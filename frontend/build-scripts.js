const execSync = require('child_process').execSync

const command = process.argv[2]
const url = process.argv[3]
const noDeps = process.argv[4] === 'no-deps'

const commands = {
    api: () => scripts.api(url),
    build: () => {
        !noDeps && run('npm install')
        scripts.api(url)
        scripts.build()
    },
    start: () => {
        scripts.api(url)
        scripts.start()
    }
}

const scripts = {
    api: (url) => generateApi(url),
    build: () => build(),
    start: () => start()
}

commands[command]
    ? commands[command]()
    : error(`Command '${command}' not found, run 'npm run ${command}'`)

function run(command) {
    execSync(command, {stdio: 'inherit'})
}

function build(name = '', suffix = '') {
    run(`react-scripts build ${suffix}`)
}

function start() {
    run('react-scripts start')
}

function generateApi(url) {
    execSync(
        'openapi-generator-cli generate' +
        ' -g typescript-axios ' +
        ` -i ../backend/core/api/src/core.openapi.yaml ` +
        ' -o src/apis/first-approval-api ' +
        ` --server-variables=URL=${url} ` +
        ' --additional-properties=stringEnums=true,enumPropertyNaming=original,removeEnumValuePrefix=false,serviceSuffix=ApiService',
        {stdio: 'inherit'}
    )
}

function error(message) {
    console.error(message)
    process.exit(1)
}
