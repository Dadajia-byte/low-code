/**
 * 自动生成api接口的脚本
 * 缺陷：
 * 1. 目前仅支持json文件的openapi文件
 * 2. 目前仅支持生成js文件，未实现ts文件生成（可以生成，但是没有interface和type定义）
 * 3. 目前没有对openapi规范进行校验，只支持部分规范（例如版本等等）
 * 4. 目前都是生成在一个文件中，希望后续能单独分开，最好支持文件夹等形式
 * 5. 不兼容各种请求参数（post/get等里的query/params/body）
 * */

import fs from 'fs';
import path from 'path';
import minimist from "minimist";

const args = minimist(process.argv.slice(2))

/**
 * 读取 OpenAPI 规范文件
 * @param {string} filePath - OpenAPI 文件路径
 * @returns {Object} 解析后的 OpenAPI 规范对象
 */
function loadOpenApiSpec(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

/**
 * 根据 OpenAPI 生成 API 文件
 * @param {Object} spec - OpenAPI 规范对象
 * @param {string} outputPath - 输出文件路径
 * @param {string} fileType - 文件类型（js 或 ts）
 */
function generateApiFile(spec, outputPath, fileType) {
    let content = `//自动生成的API文件\n\n`;
    content += `import {request} from './src/utils/request.${fileType}';\n\n`;

    // 遍历 OpenAPI 规范生成函数
    for (const [path, methods] of Object.entries(spec.paths)) {
        for (const [method, details] of Object.entries(methods)) {
            const operationId = details.operationId || `${method}${path.replace(/\//g, '_')}`;
            const params = details.parameters ? details.parameters.map(param => param.name).join(', ') : '';
            content += `export const ${operationId} = async (${params}) => {\n`;
            content += `    return await request({\n`;
            content += `        url: '${path}',\n`;
            content += `        method: '${method.toUpperCase()}',\n`;
            content += `        params: { ${params} },\n`;
            content += `    });\n`;
            content += `};\n\n`;
        }
    }
    fs.writeFileSync(outputPath, content, 'utf-8');
}

/**
 * 主函数
 * @param {string} openApiFilePath - OpenAPI 文件路径
 * @param {string} outputPath - 输出文件路径
 * @param {string} fileType - 文件类型（js 或 ts）
 */
function createApi(openApiFilePath, outputPath, fileType = 'js') {
    const spec = loadOpenApiSpec(openApiFilePath);
    generateApiFile(spec, outputPath, fileType);
}

// 使用
const openApiFilePath = path.resolve('./src/apis/generator/openapi.json'); // OpenAPI 规范文件路径
const fileType = args['ft'] || 'js'; // -ft 后跟的参数，默认是js
const outputPath = path.resolve(`./src/apis/generator/generatedApi.${fileType}`); // 生成的 API 文件路径

createApi(openApiFilePath, outputPath, fileType);
