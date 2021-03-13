import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";

export default {
    input: "./eVue-03/index.js", // 引入的文件
    output: [
        {
            format: "umd", //  五种输出格式：amd /  es6 / iife / umd / cjs
            file: "eVue/eVue.js",
            name: "EVue",
            sourcemap: true,
        },
        { file: "eVue/eVue.common.js", format: "cjs", name: "eVue", sourcemap: true },
        { file: "eVue/eVue.esm.js", format: "es", name: "eVue", sourcemap: true },
    ],
    plugins: [
        babel({
            // 解析es6 -》 es5
            extensions: [".js", ".ts"],
            exclude: "node_modules/**", // 排除文件的操作 glob
        }),
        serve({
            // 开启本地服务
            open: true,
            openPage: "/eVue-03/index.html", // 打开的页面
            port: 7777,
            contentBase: "", //服务器启动的文件夹，默认是项目根目录，需要在该文件下创建index.html
        }),
    ],
};
