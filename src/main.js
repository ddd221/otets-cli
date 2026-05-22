import chalk from 'chalk';
import { createRequire } from 'module';
import { config } from './config.js';
import { APIClient } from './api/client.js';
import { Cache } from './api/cache.js';
import { UI } from './ui/renderer.js';
import { logger } from './utils/logger.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

class OtetsCLI {
  constructor() {
    this.config = config;
    this.api = new APIClient();
    this.cache = new Cache();
    this.ui = new UI(this.config);
    this.isRunning = true;
    this.currentPage = 0;
    this.posts = [];
  }

  async init() {
    this.displayBanner();
    
    try {
      logger.info('Initializing OTETS CLI...');
      
      // Setup signal handlers
      this.setupSignalHandlers();
      
      // Load configuration from .env
      logger.debug('Loading configuration...');
      
      // Initialize cache
      await this.cache.init();
      logger.debug('Cache initialized');
      
      // Display welcome message
      this.displayWelcome();
      
      // Start main loop
      await this.run();
    } catch (error) {
      logger.error('Fatal error during initialization:', error);
      this.ui.error(`\\n${chalk.red('✗ Fatal Error:')} ${error.message}`);
      process.exit(1);
    }
  }

  displayBanner() {
    const banner = chalk.cyan(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                     🖥️  OTETS-CLI                          ║
  ║           Live CLI Client for Father's Posts              ║
  ║                                                           ║
  ║  v${pkg.version.padEnd(50)} ║
  ╚═══════════════════════════════════════════════════════════╝
    `);
    console.log(banner);
  }

  displayWelcome() {
    const welcome = chalk.magenta(`
  📡 Connecting to the API...
  🎨 Loading posts with synthwave vibes...
  ⌨️  Press 'h' for help, 'q' to quit
  `);
    console.log(welcome);
  }

  setupSignalHandlers() {
    process.on('SIGINT', () => this.exit());
    process.on('SIGTERM', () => this.exit());
  }

  async run() {
    try {
      // Simulate fetching posts with fallback to cache
      logger.debug('Fetching posts...');
      
      this.posts = await this.fetchPostsWithFallback();
      
      if (this.posts.length === 0) {
        this.ui.error('\\n✗ No posts available. Check your internet connection.');
        return;
      }

      logger.info(`Successfully loaded ${this.posts.length} posts`);
      
      // Display first page
      this.displayPage(0);
      
      // Interactive loop
      await this.interactiveLoop();
    } catch (error) {
      logger.error('Error in main run loop:', error);
      this.ui.error(`Error: ${error.message}`);
    }
  }

  async fetchPostsWithFallback() {
    try {
      logger.debug('Attempting to fetch from API...');
      const posts = await this.api.fetchPosts();
      await this.cache.set('posts', posts);
      return posts;
    } catch (apiError) {
      logger.warn('API fetch failed, attempting cache fallback:', apiError.message);
      const cachedPosts = await this.cache.get('posts');
      if (cachedPosts) {
        console.log(chalk.yellow('\\n⚠️  Using cached posts (API unavailable)\\n'));
        return cachedPosts;
      }
      throw apiError;
    }
  }

  displayPage(pageNum) {
    if (!this.posts.length) {
      this.ui.error('No posts to display');
      return;
    }

    const postsPerPage = 5;
    const start = pageNum * postsPerPage;
    const end = Math.min(start + postsPerPage, this.posts.length);
    const pagesPosts = this.posts.slice(start, end);

    console.clear();
    this.displayBanner();

    console.log(chalk.cyan(`\\n📖 Page ${pageNum + 1} of ${Math.ceil(this.posts.length / postsPerPage)}\\n`));

    pagesPosts.forEach((post, idx) => {
      this.ui.renderPost(post, start + idx + 1);
      console.log('');
    });

    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.gray('j/↓: next  k/↑: prev  /: search  h: help  q: quit'));
  }

  async interactiveLoop() {
    // In a real implementation, this would handle keyboard input
    // For now, we'll display a demo and exit
    console.log(chalk.cyan('\\n✓ CLI is ready and working!'));
    console.log(chalk.gray('In full implementation, keyboard controls would be active here.\\n'));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  exit() {
    console.log(chalk.cyan('\\n\\n👋 Thanks for using OTETS-CLI!\\n'));
    process.exit(0);
  }
}

// Main entry point
const cli = new OtetsCLI();
await cli.init();
