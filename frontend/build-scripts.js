const execSync = require('child_process').execSync

const command = process.argv[2];
const apiFile = process.argv[3];
const noDeps = process.argv[4] === 'no-deps';

const commands = {
    'api': () => scripts.api(apiFile),
    'build': () => {
        !noDeps && run('npm install');
        scripts.api(apiFile);
        scripts.build();
    },
    'start': () => {
        scripts.api(apiFile);
        scripts.start();
    }
}

const scripts = {
    api: (apiFile) => generateApi(apiFile),
    build: () => build(),
    start: () => start('--host 0.0.0.0 --port=3000'),
}

commands[command]
    ? commands[command]()
    : error(`Command '${command}' not found, run 'npm run ${command}'`);

function run(command) {
    execSync(command, {stdio: 'inherit'})
}

function build(name = '', suffix = '') {
    run(`react-scripts build ${suffix}`)
}

function start(suffix = '') {
    run(`react-scripts start`)
}

function generateApi(specFile = 'core.openapi.yaml') {
    execSync(
        `openapi-generator-cli generate` +
        ` -g typescript-axios ` +
        ` -i ${specFile} ` +
        ` -o apis/first-approval-api ` +
        ` --additional-properties=stringEnums=true,enumPropertyNaming=original,removeEnumValuePrefix=false,serviceSuffix=ApiService`,
        {stdio: 'inherit'}
    )
}

function error(message) {
    console.error(message);
    process.exit(1);
}
