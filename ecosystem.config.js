module.exports = {
    apps: [
        {
            name: "TSServer",
            script: "ts-node",
            port: 3000,
            args: "./app/app.ts", // replace this with your project's entry file
            exec_mode: "fork",
            interpreter: "node@16.18.0", // or any installed version
        },
    ],
};