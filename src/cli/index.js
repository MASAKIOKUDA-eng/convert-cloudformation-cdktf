#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const path = require("path");
const parser_1 = require("../parser");
const mapper_1 = require("../mapper");
const generator_1 = require("../generator");
async function main() {
    const argv = await yargs
        .option('input', {
        alias: 'i',
        description: 'Input CloudFormation template file',
        type: 'string',
        demandOption: true,
    })
        .option('output', {
        alias: 'o',
        description: 'Output directory for CDKTF code',
        type: 'string',
        default: './cdktf-output',
    })
        .option('language', {
        alias: 'l',
        description: 'Target language for CDKTF code',
        choices: ['typescript', 'python', 'java'],
        default: 'typescript',
    })
        .help()
        .alias('help', 'h').argv;
    try {
        console.log(`Parsing CloudFormation template: ${argv.input}`);
        const template = parser_1.CloudFormationParser.parseFile(argv.input);
        console.log('Mapping CloudFormation resources to Terraform resources');
        const terraformConfig = mapper_1.ResourceMapper.mapTemplate(template);
        console.log(`Generating CDKTF code in ${argv.language}`);
        generator_1.CdktfGenerator.generateCode(terraformConfig, argv.output, argv.language);
        console.log(`CDKTF code generated successfully in ${path.resolve(argv.output)}`);
    }
    catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}
main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQkFBK0I7QUFDL0IsNkJBQTZCO0FBQzdCLHNDQUFpRDtBQUNqRCxzQ0FBMkM7QUFDM0MsNENBQThDO0FBRTlDLEtBQUssVUFBVSxJQUFJO0lBQ2pCLE1BQU0sSUFBSSxHQUFHLE1BQU0sS0FBSztTQUNyQixNQUFNLENBQUMsT0FBTyxFQUFFO1FBQ2YsS0FBSyxFQUFFLEdBQUc7UUFDVixXQUFXLEVBQUUsb0NBQW9DO1FBQ2pELElBQUksRUFBRSxRQUFRO1FBQ2QsWUFBWSxFQUFFLElBQUk7S0FDbkIsQ0FBQztTQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDaEIsS0FBSyxFQUFFLEdBQUc7UUFDVixXQUFXLEVBQUUsaUNBQWlDO1FBQzlDLElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxFQUFFLGdCQUFnQjtLQUMxQixDQUFDO1NBQ0QsTUFBTSxDQUFDLFVBQVUsRUFBRTtRQUNsQixLQUFLLEVBQUUsR0FBRztRQUNWLFdBQVcsRUFBRSxnQ0FBZ0M7UUFDN0MsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUM7UUFDekMsT0FBTyxFQUFFLFlBQVk7S0FDdEIsQ0FBQztTQUNELElBQUksRUFBRTtTQUNOLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBRTNCLElBQUksQ0FBQztRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzlELE1BQU0sUUFBUSxHQUFHLDZCQUFvQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFNUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sZUFBZSxHQUFHLHVCQUFjLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTdELE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELDBCQUFjLENBQUMsWUFBWSxDQUN6QixlQUFlLEVBQ2YsSUFBSSxDQUFDLE1BQU0sRUFDWCxJQUFJLENBQUMsUUFBNEMsQ0FDbEQsQ0FBQztRQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFHLEtBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7QUFDSCxDQUFDO0FBRUQsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDekMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAqIGFzIHlhcmdzIGZyb20gJ3lhcmdzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBDbG91ZEZvcm1hdGlvblBhcnNlciB9IGZyb20gJy4uL3BhcnNlcic7XG5pbXBvcnQgeyBSZXNvdXJjZU1hcHBlciB9IGZyb20gJy4uL21hcHBlcic7XG5pbXBvcnQgeyBDZGt0ZkdlbmVyYXRvciB9IGZyb20gJy4uL2dlbmVyYXRvcic7XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIGNvbnN0IGFyZ3YgPSBhd2FpdCB5YXJnc1xuICAgIC5vcHRpb24oJ2lucHV0Jywge1xuICAgICAgYWxpYXM6ICdpJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSW5wdXQgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgZmlsZScsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlbWFuZE9wdGlvbjogdHJ1ZSxcbiAgICB9KVxuICAgIC5vcHRpb24oJ291dHB1dCcsIHtcbiAgICAgIGFsaWFzOiAnbycsXG4gICAgICBkZXNjcmlwdGlvbjogJ091dHB1dCBkaXJlY3RvcnkgZm9yIENES1RGIGNvZGUnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnLi9jZGt0Zi1vdXRwdXQnLFxuICAgIH0pXG4gICAgLm9wdGlvbignbGFuZ3VhZ2UnLCB7XG4gICAgICBhbGlhczogJ2wnLFxuICAgICAgZGVzY3JpcHRpb246ICdUYXJnZXQgbGFuZ3VhZ2UgZm9yIENES1RGIGNvZGUnLFxuICAgICAgY2hvaWNlczogWyd0eXBlc2NyaXB0JywgJ3B5dGhvbicsICdqYXZhJ10sXG4gICAgICBkZWZhdWx0OiAndHlwZXNjcmlwdCcsXG4gICAgfSlcbiAgICAuaGVscCgpXG4gICAgLmFsaWFzKCdoZWxwJywgJ2gnKS5hcmd2O1xuXG4gIHRyeSB7XG4gICAgY29uc29sZS5sb2coYFBhcnNpbmcgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGU6ICR7YXJndi5pbnB1dH1gKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IENsb3VkRm9ybWF0aW9uUGFyc2VyLnBhcnNlRmlsZShhcmd2LmlucHV0KTtcbiAgICBcbiAgICBjb25zb2xlLmxvZygnTWFwcGluZyBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZXMgdG8gVGVycmFmb3JtIHJlc291cmNlcycpO1xuICAgIGNvbnN0IHRlcnJhZm9ybUNvbmZpZyA9IFJlc291cmNlTWFwcGVyLm1hcFRlbXBsYXRlKHRlbXBsYXRlKTtcbiAgICBcbiAgICBjb25zb2xlLmxvZyhgR2VuZXJhdGluZyBDREtURiBjb2RlIGluICR7YXJndi5sYW5ndWFnZX1gKTtcbiAgICBDZGt0ZkdlbmVyYXRvci5nZW5lcmF0ZUNvZGUoXG4gICAgICB0ZXJyYWZvcm1Db25maWcsIFxuICAgICAgYXJndi5vdXRwdXQsIFxuICAgICAgYXJndi5sYW5ndWFnZSBhcyAndHlwZXNjcmlwdCcgfCAncHl0aG9uJyB8ICdqYXZhJ1xuICAgICk7XG4gICAgXG4gICAgY29uc29sZS5sb2coYENES1RGIGNvZGUgZ2VuZXJhdGVkIHN1Y2Nlc3NmdWxseSBpbiAke3BhdGgucmVzb2x2ZShhcmd2Lm91dHB1dCl9YCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3I6JywgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKTtcbiAgICBwcm9jZXNzLmV4aXQoMSk7XG4gIH1cbn1cblxubWFpbigpLmNhdGNoKGVycm9yID0+IHtcbiAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIGVycm9yOicsIGVycm9yKTtcbiAgcHJvY2Vzcy5leGl0KDEpO1xufSk7XG4iXX0=