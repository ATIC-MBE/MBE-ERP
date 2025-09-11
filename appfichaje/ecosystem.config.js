module.exports = {
  apps: [
    {
      name: 'mbeApi',
      script: 'npm',
      args: 'run dev',
      cwd: './mbeApi',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'develop',
        PORT: 3006
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3006
      },
      log_file: './logs/mbeApi-combined.log',
      out_file: './logs/mbeApi-out.log',
      error_file: './logs/mbeApi-error.log',
      time: true
    },
    {
      name: 'mbeapp',
      script: 'npm',
      args: 'start',
      cwd: './mbeapp',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'develop',
        PORT: 3005
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3005
      },
      log_file: './logs/mbeapp-combined.log',
      out_file: './logs/mbeapp-out.log',
      error_file: './logs/mbeapp-error.log',
      time: true
    },
    {
      name: 'mbeappClient',
      script: 'npm',
      args: 'run dev',
      cwd: './mbeappClient',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'develop',
        PORT: 6969
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 6969
      },
      log_file: './logs/mbeappClient-combined.log',
      out_file: './logs/mbeappClient-out.log',
      error_file: './logs/mbeappClient-error.log',
      time: true
    }
  ]
};
