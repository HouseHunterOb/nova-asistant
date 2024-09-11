const logger = {
    info: async (message) => {
        const chalk = (await import('chalk')).default;
        console.log(chalk.blue(`[INFO] ${message}`));
    },
    success: async (message) => {
        const chalk = (await import('chalk')).default;
        console.log(chalk.green(`[SUCCESS] ${message}`));
    },
    error: async (message) => {
        const chalk = (await import('chalk')).default;
        console.log(chalk.red(`[ERROR] ${message}`));
    },
};

module.exports = logger;
