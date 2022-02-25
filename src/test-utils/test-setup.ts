import {GenericContainer, StartedTestContainer} from "testcontainers";
// eslint-disable-next-line
const NodeEnvironment = require('jest-environment-node');

class TestEnv extends NodeEnvironment {
    private container : StartedTestContainer;

    async setup() {
        await super.setup();
        this.container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();

        this.global.process.env = {
            ...process.env,
            ...{
                MONGO_CONN_STRING: `mongodb://${this.container.getHost()}:${this.container.getMappedPort(
                    27017,
                )}/CARS`,
            }
        }
    }
    async teardown() {
        await super.teardown();
        await this.container.stop();
    }
}


module.exports = TestEnv;