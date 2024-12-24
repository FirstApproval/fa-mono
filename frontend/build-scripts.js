const execSync = require('child_process').execSync;

const command = process.argv[2];
const url = process.argv[3];
const apiFile = process.argv[4]
const noDeps = process.argv[5] === 'no-deps';

const commands = {
  api: (url, apiFile) => scripts.api(url, apiFile),
  build: () => {
    !noDeps && run('npm install');
    scripts.api(url, apiFile);
    scripts.build();
  },
  start: () => {
    scripts.api(url, apiFile);
    scripts.start();
  }
};

const scripts = {
  api: (url, apiFile) => generateApi(url, apiFile),
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

function generateApi(url, apiFile) {
  execSync(
    'openapi-generator-cli generate' +
      ' -g typescript-axios ' +
      ` -i ${apiFile} ` +
      ' -o src/apis/first-approval-api ' +
      ` --server-variables=URL=${url} ` +
      ' --additional-properties=stringEnums=true,enumPropertyNaming=original,removeEnumValuePrefix=false,serviceSuffix=ApiService',
    { stdio: 'inherit' }
  );
}

function error(message) {
  console.error(message);
  process.exit(1);
}
