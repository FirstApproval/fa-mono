const execSync = require('child_process').execSync;

const command = process.argv[2];
const url = process.argv[3];
const noDeps = process.argv[4] === 'no-deps';

const commands = {
  api: () => scripts.api(url),
  build: () => {
    !noDeps && run('npm install');
    scripts.api(url);
    scripts.build();
  },
  start: () => {
    scripts.api(url);
    scripts.start();
  }
};

const scripts = {
  api: (url) => generateApi(url),
  build: () => build(),
  start: () => start()
};

commands[command]
  ? commands[command]()
  : error(`Command '${command}' not found, run 'npm run ${command}'`);

function run(command, notGenerateSourceMap) {
  execSync(command, {
    stdio: 'inherit',
    env: {
      ...process.env,
      devtool: false
    }
  });
}

function build(name = '', suffix = '') {
  run(`react-scripts build ${suffix}`);
}

function start() {
  run('react-scripts start');
}

function generateApi(url) {
}

function error(message) {
  console.error(message);
  process.exit(1);
}
