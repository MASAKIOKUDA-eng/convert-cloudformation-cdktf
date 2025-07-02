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
        .alias('help', 'h')
        .parseSync();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLCtCQUErQjtBQUMvQiw2QkFBNkI7QUFDN0Isc0NBQWlEO0FBQ2pELHNDQUEyQztBQUMzQyw0Q0FBOEM7QUFFOUMsS0FBSyxVQUFVLElBQUk7SUFDakIsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLO1NBQ3JCLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDZixLQUFLLEVBQUUsR0FBRztRQUNWLFdBQVcsRUFBRSxvQ0FBb0M7UUFDakQsSUFBSSxFQUFFLFFBQVE7UUFDZCxZQUFZLEVBQUUsSUFBSTtLQUNuQixDQUFDO1NBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNoQixLQUFLLEVBQUUsR0FBRztRQUNWLFdBQVcsRUFBRSxpQ0FBaUM7UUFDOUMsSUFBSSxFQUFFLFFBQVE7UUFDZCxPQUFPLEVBQUUsZ0JBQWdCO0tBQzFCLENBQUM7U0FDRCxNQUFNLENBQUMsVUFBVSxFQUFFO1FBQ2xCLEtBQUssRUFBRSxHQUFHO1FBQ1YsV0FBVyxFQUFFLGdDQUFnQztRQUM3QyxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQztRQUN6QyxPQUFPLEVBQUUsWUFBWTtLQUN0QixDQUFDO1NBQ0QsSUFBSSxFQUFFO1NBQ04sS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7U0FDbEIsU0FBUyxFQUFFLENBQUM7SUFFZixJQUFJLENBQUM7UUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM5RCxNQUFNLFFBQVEsR0FBRyw2QkFBb0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTVELE9BQU8sQ0FBQyxHQUFHLENBQUMseURBQXlELENBQUMsQ0FBQztRQUN2RSxNQUFNLGVBQWUsR0FBRyx1QkFBYyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU3RCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN6RCwwQkFBYyxDQUFDLFlBQVksQ0FDekIsZUFBZSxFQUNmLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLFFBQTRDLENBQ2xELENBQUM7UUFFRixPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRyxLQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixDQUFDO0FBQ0gsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgKiBhcyB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQ2xvdWRGb3JtYXRpb25QYXJzZXIgfSBmcm9tICcuLi9wYXJzZXInO1xuaW1wb3J0IHsgUmVzb3VyY2VNYXBwZXIgfSBmcm9tICcuLi9tYXBwZXInO1xuaW1wb3J0IHsgQ2RrdGZHZW5lcmF0b3IgfSBmcm9tICcuLi9nZW5lcmF0b3InO1xuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICBjb25zdCBhcmd2ID0gYXdhaXQgeWFyZ3NcbiAgICAub3B0aW9uKCdpbnB1dCcsIHtcbiAgICAgIGFsaWFzOiAnaScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0lucHV0IENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIGZpbGUnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZW1hbmRPcHRpb246IHRydWUsXG4gICAgfSlcbiAgICAub3B0aW9uKCdvdXRwdXQnLCB7XG4gICAgICBhbGlhczogJ28nLFxuICAgICAgZGVzY3JpcHRpb246ICdPdXRwdXQgZGlyZWN0b3J5IGZvciBDREtURiBjb2RlJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJy4vY2RrdGYtb3V0cHV0JyxcbiAgICB9KVxuICAgIC5vcHRpb24oJ2xhbmd1YWdlJywge1xuICAgICAgYWxpYXM6ICdsJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGFyZ2V0IGxhbmd1YWdlIGZvciBDREtURiBjb2RlJyxcbiAgICAgIGNob2ljZXM6IFsndHlwZXNjcmlwdCcsICdweXRob24nLCAnamF2YSddLFxuICAgICAgZGVmYXVsdDogJ3R5cGVzY3JpcHQnLFxuICAgIH0pXG4gICAgLmhlbHAoKVxuICAgIC5hbGlhcygnaGVscCcsICdoJylcbiAgICAucGFyc2VTeW5jKCk7XG5cbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhgUGFyc2luZyBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZTogJHthcmd2LmlucHV0fWApO1xuICAgIGNvbnN0IHRlbXBsYXRlID0gQ2xvdWRGb3JtYXRpb25QYXJzZXIucGFyc2VGaWxlKGFyZ3YuaW5wdXQpO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKCdNYXBwaW5nIENsb3VkRm9ybWF0aW9uIHJlc291cmNlcyB0byBUZXJyYWZvcm0gcmVzb3VyY2VzJyk7XG4gICAgY29uc3QgdGVycmFmb3JtQ29uZmlnID0gUmVzb3VyY2VNYXBwZXIubWFwVGVtcGxhdGUodGVtcGxhdGUpO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKGBHZW5lcmF0aW5nIENES1RGIGNvZGUgaW4gJHthcmd2Lmxhbmd1YWdlfWApO1xuICAgIENka3RmR2VuZXJhdG9yLmdlbmVyYXRlQ29kZShcbiAgICAgIHRlcnJhZm9ybUNvbmZpZywgXG4gICAgICBhcmd2Lm91dHB1dCwgXG4gICAgICBhcmd2Lmxhbmd1YWdlIGFzICd0eXBlc2NyaXB0JyB8ICdweXRob24nIHwgJ2phdmEnXG4gICAgKTtcbiAgICBcbiAgICBjb25zb2xlLmxvZyhgQ0RLVEYgY29kZSBnZW5lcmF0ZWQgc3VjY2Vzc2Z1bGx5IGluICR7cGF0aC5yZXNvbHZlKGFyZ3Yub3V0cHV0KX1gKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvcjonLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpO1xuICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgfVxufVxuXG5tYWluKCkuY2F0Y2goZXJyb3IgPT4ge1xuICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgZXJyb3I6JywgZXJyb3IpO1xuICBwcm9jZXNzLmV4aXQoMSk7XG59KTtcbiJdfQ==