"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudFormationParser = void 0;
const fs = require("fs");
const yaml = require("js-yaml");
/**
 * CloudFormation template parser
 */
class CloudFormationParser {
    /**
     * Parse a CloudFormation template from a file
     * @param filePath Path to the CloudFormation template file
     */
    static parseFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (filePath.endsWith('.json')) {
            return JSON.parse(content);
        }
        else if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
            // CloudFormationの特殊タグを処理するための前処理
            const processedContent = this.preprocessCloudFormationTags(content);
            return yaml.load(processedContent);
        }
        else {
            throw new Error(`Unsupported file format: ${filePath}`);
        }
    }
    /**
     * CloudFormationの特殊タグを処理するための前処理
     * @param content YAMLコンテンツ
     */
    static preprocessCloudFormationTags(content) {
        // !Ref タグを処理
        content = content.replace(/!Ref\s+([^\s]+)/g, '{ "Ref": "$1" }');
        // !GetAtt タグを処理
        content = content.replace(/!GetAtt\s+([^\s]+)\.([^\s]+)/g, '{ "Fn::GetAtt": ["$1", "$2"] }');
        // !Sub タグを処理
        content = content.replace(/!Sub\s+'([^']+)'/g, '{ "Fn::Sub": "$1" }');
        content = content.replace(/!Sub\s+"([^"]+)"/g, '{ "Fn::Sub": "$1" }');
        content = content.replace(/!Sub\s+([^\s'"]+)/g, '{ "Fn::Sub": "$1" }');
        // !Join タグを処理
        content = content.replace(/!Join\s+\[\s*'([^']+)'\s*,\s*\[(.*?)\]\s*\]/g, '{ "Fn::Join": ["$1", [$2]] }');
        content = content.replace(/!Join\s+\[\s*"([^"]+)"\s*,\s*\[(.*?)\]\s*\]/g, '{ "Fn::Join": ["$1", [$2]] }');
        return content;
    }
}
exports.CloudFormationParser = CloudFormationParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFyc2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUF5QjtBQUN6QixnQ0FBZ0M7QUFnQmhDOztHQUVHO0FBQ0gsTUFBYSxvQkFBb0I7SUFDL0I7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFnQjtRQUN0QyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVsRCxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUMvQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUEyQixDQUFDO1FBQ3ZELENBQUM7YUFBTSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ25FLGlDQUFpQztZQUNqQyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQTJCLENBQUM7UUFDL0QsQ0FBQzthQUFNLENBQUM7WUFDTixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzFELENBQUM7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssTUFBTSxDQUFDLDRCQUE0QixDQUFDLE9BQWU7UUFDekQsYUFBYTtRQUNiLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFakUsZ0JBQWdCO1FBQ2hCLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLCtCQUErQixFQUFFLGdDQUFnQyxDQUFDLENBQUM7UUFFN0YsYUFBYTtRQUNiLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLHFCQUFxQixDQUFDLENBQUM7UUFDdEUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUN0RSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBRXZFLGNBQWM7UUFDZCxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyw4Q0FBOEMsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1FBQzFHLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLDhDQUE4QyxFQUFFLDhCQUE4QixDQUFDLENBQUM7UUFFMUcsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUNGO0FBekNELG9EQXlDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHlhbWwgZnJvbSAnanMteWFtbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRGb3JtYXRpb25UZW1wbGF0ZSB7XG4gIEFXU1RlbXBsYXRlRm9ybWF0VmVyc2lvbj86IHN0cmluZztcbiAgRGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIFBhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBSZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIENsb3VkRm9ybWF0aW9uUmVzb3VyY2U+O1xuICBPdXRwdXRzPzogUmVjb3JkPHN0cmluZywgYW55Pjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbG91ZEZvcm1hdGlvblJlc291cmNlIHtcbiAgVHlwZTogc3RyaW5nO1xuICBQcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBEZXBlbmRzT24/OiBzdHJpbmcgfCBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBwYXJzZXJcbiAqL1xuZXhwb3J0IGNsYXNzIENsb3VkRm9ybWF0aW9uUGFyc2VyIHtcbiAgLyoqXG4gICAqIFBhcnNlIGEgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgZnJvbSBhIGZpbGVcbiAgICogQHBhcmFtIGZpbGVQYXRoIFBhdGggdG8gdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIGZpbGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2VGaWxlKGZpbGVQYXRoOiBzdHJpbmcpOiBDbG91ZEZvcm1hdGlvblRlbXBsYXRlIHtcbiAgICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpO1xuICAgIFxuICAgIGlmIChmaWxlUGF0aC5lbmRzV2l0aCgnLmpzb24nKSkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoY29udGVudCkgYXMgQ2xvdWRGb3JtYXRpb25UZW1wbGF0ZTtcbiAgICB9IGVsc2UgaWYgKGZpbGVQYXRoLmVuZHNXaXRoKCcueWFtbCcpIHx8IGZpbGVQYXRoLmVuZHNXaXRoKCcueW1sJykpIHtcbiAgICAgIC8vIENsb3VkRm9ybWF0aW9u44Gu54m55q6K44K/44Kw44KS5Yem55CG44GZ44KL44Gf44KB44Gu5YmN5Yem55CGXG4gICAgICBjb25zdCBwcm9jZXNzZWRDb250ZW50ID0gdGhpcy5wcmVwcm9jZXNzQ2xvdWRGb3JtYXRpb25UYWdzKGNvbnRlbnQpO1xuICAgICAgcmV0dXJuIHlhbWwubG9hZChwcm9jZXNzZWRDb250ZW50KSBhcyBDbG91ZEZvcm1hdGlvblRlbXBsYXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZpbGUgZm9ybWF0OiAke2ZpbGVQYXRofWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbG91ZEZvcm1hdGlvbuOBrueJueauiuOCv+OCsOOCkuWHpueQhuOBmeOCi+OBn+OCgeOBruWJjeWHpueQhlxuICAgKiBAcGFyYW0gY29udGVudCBZQU1M44Kz44Oz44OG44Oz44OEXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBwcmVwcm9jZXNzQ2xvdWRGb3JtYXRpb25UYWdzKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgLy8gIVJlZiDjgr/jgrDjgpLlh6bnkIZcbiAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKC8hUmVmXFxzKyhbXlxcc10rKS9nLCAneyBcIlJlZlwiOiBcIiQxXCIgfScpO1xuICAgIFxuICAgIC8vICFHZXRBdHQg44K/44Kw44KS5Yem55CGXG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvIUdldEF0dFxccysoW15cXHNdKylcXC4oW15cXHNdKykvZywgJ3sgXCJGbjo6R2V0QXR0XCI6IFtcIiQxXCIsIFwiJDJcIl0gfScpO1xuICAgIFxuICAgIC8vICFTdWIg44K/44Kw44KS5Yem55CGXG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvIVN1YlxccysnKFteJ10rKScvZywgJ3sgXCJGbjo6U3ViXCI6IFwiJDFcIiB9Jyk7XG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvIVN1YlxccytcIihbXlwiXSspXCIvZywgJ3sgXCJGbjo6U3ViXCI6IFwiJDFcIiB9Jyk7XG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvIVN1YlxccysoW15cXHMnXCJdKykvZywgJ3sgXCJGbjo6U3ViXCI6IFwiJDFcIiB9Jyk7XG4gICAgXG4gICAgLy8gIUpvaW4g44K/44Kw44KS5Yem55CGXG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvIUpvaW5cXHMrXFxbXFxzKicoW14nXSspJ1xccyosXFxzKlxcWyguKj8pXFxdXFxzKlxcXS9nLCAneyBcIkZuOjpKb2luXCI6IFtcIiQxXCIsIFskMl1dIH0nKTtcbiAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKC8hSm9pblxccytcXFtcXHMqXCIoW15cIl0rKVwiXFxzKixcXHMqXFxbKC4qPylcXF1cXHMqXFxdL2csICd7IFwiRm46OkpvaW5cIjogW1wiJDFcIiwgWyQyXV0gfScpO1xuICAgIFxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG59XG4iXX0=