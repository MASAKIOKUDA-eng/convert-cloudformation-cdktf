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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLCtCQUErQjtBQUMvQiw2QkFBNkI7QUFDN0Isc0NBQWlEO0FBQ2pELHNDQUEyQztBQUMzQyw0Q0FBOEM7QUFFOUMsS0FBSyxVQUFVLElBQUk7SUFDakIsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLO1NBQ3JCLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDZixLQUFLLEVBQUUsR0FBRztRQUNWLFdBQVcsRUFBRSxvQ0FBb0M7UUFDakQsSUFBSSxFQUFFLFFBQVE7UUFDZCxZQUFZLEVBQUUsSUFBSTtLQUNuQixDQUFDO1NBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNoQixLQUFLLEVBQUUsR0FBRztRQUNWLFdBQVcsRUFBRSxpQ0FBaUM7UUFDOUMsSUFBSSxFQUFFLFFBQVE7UUFDZCxPQUFPLEVBQUUsZ0JBQWdCO0tBQzFCLENBQUM7U0FDRCxNQUFNLENBQUMsVUFBVSxFQUFFO1FBQ2xCLEtBQUssRUFBRSxHQUFHO1FBQ1YsV0FBVyxFQUFFLGdDQUFnQztRQUM3QyxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQztRQUN6QyxPQUFPLEVBQUUsWUFBWTtLQUN0QixDQUFDO1NBQ0QsSUFBSSxFQUFFO1NBQ04sS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFFM0IsSUFBSSxDQUFDO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDOUQsTUFBTSxRQUFRLEdBQUcsNkJBQW9CLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1RCxPQUFPLENBQUMsR0FBRyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7UUFDdkUsTUFBTSxlQUFlLEdBQUcsdUJBQWMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDekQsMEJBQWMsQ0FBQyxZQUFZLENBQ3pCLGVBQWUsRUFDZixJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQyxRQUE0QyxDQUNsRCxDQUFDO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUcsS0FBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztBQUNILENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IENsb3VkRm9ybWF0aW9uUGFyc2VyIH0gZnJvbSAnLi4vcGFyc2VyJztcbmltcG9ydCB7IFJlc291cmNlTWFwcGVyIH0gZnJvbSAnLi4vbWFwcGVyJztcbmltcG9ydCB7IENka3RmR2VuZXJhdG9yIH0gZnJvbSAnLi4vZ2VuZXJhdG9yJztcblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcbiAgY29uc3QgYXJndiA9IGF3YWl0IHlhcmdzXG4gICAgLm9wdGlvbignaW5wdXQnLCB7XG4gICAgICBhbGlhczogJ2knLFxuICAgICAgZGVzY3JpcHRpb246ICdJbnB1dCBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBmaWxlJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVtYW5kT3B0aW9uOiB0cnVlLFxuICAgIH0pXG4gICAgLm9wdGlvbignb3V0cHV0Jywge1xuICAgICAgYWxpYXM6ICdvJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnT3V0cHV0IGRpcmVjdG9yeSBmb3IgQ0RLVEYgY29kZScsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICcuL2Nka3RmLW91dHB1dCcsXG4gICAgfSlcbiAgICAub3B0aW9uKCdsYW5ndWFnZScsIHtcbiAgICAgIGFsaWFzOiAnbCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RhcmdldCBsYW5ndWFnZSBmb3IgQ0RLVEYgY29kZScsXG4gICAgICBjaG9pY2VzOiBbJ3R5cGVzY3JpcHQnLCAncHl0aG9uJywgJ2phdmEnXSxcbiAgICAgIGRlZmF1bHQ6ICd0eXBlc2NyaXB0JyxcbiAgICB9KVxuICAgIC5oZWxwKClcbiAgICAuYWxpYXMoJ2hlbHAnLCAnaCcpLmFyZ3Y7XG5cbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhgUGFyc2luZyBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZTogJHthcmd2LmlucHV0fWApO1xuICAgIGNvbnN0IHRlbXBsYXRlID0gQ2xvdWRGb3JtYXRpb25QYXJzZXIucGFyc2VGaWxlKGFyZ3YuaW5wdXQpO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKCdNYXBwaW5nIENsb3VkRm9ybWF0aW9uIHJlc291cmNlcyB0byBUZXJyYWZvcm0gcmVzb3VyY2VzJyk7XG4gICAgY29uc3QgdGVycmFmb3JtQ29uZmlnID0gUmVzb3VyY2VNYXBwZXIubWFwVGVtcGxhdGUodGVtcGxhdGUpO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKGBHZW5lcmF0aW5nIENES1RGIGNvZGUgaW4gJHthcmd2Lmxhbmd1YWdlfWApO1xuICAgIENka3RmR2VuZXJhdG9yLmdlbmVyYXRlQ29kZShcbiAgICAgIHRlcnJhZm9ybUNvbmZpZywgXG4gICAgICBhcmd2Lm91dHB1dCwgXG4gICAgICBhcmd2Lmxhbmd1YWdlIGFzICd0eXBlc2NyaXB0JyB8ICdweXRob24nIHwgJ2phdmEnXG4gICAgKTtcbiAgICBcbiAgICBjb25zb2xlLmxvZyhgQ0RLVEYgY29kZSBnZW5lcmF0ZWQgc3VjY2Vzc2Z1bGx5IGluICR7cGF0aC5yZXNvbHZlKGFyZ3Yub3V0cHV0KX1gKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvcjonLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpO1xuICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgfVxufVxuXG5tYWluKCkuY2F0Y2goZXJyb3IgPT4ge1xuICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgZXJyb3I6JywgZXJyb3IpO1xuICBwcm9jZXNzLmV4aXQoMSk7XG59KTtcbiJdfQ==