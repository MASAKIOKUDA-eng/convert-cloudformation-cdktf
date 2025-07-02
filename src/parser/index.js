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
            return yaml.load(content);
        }
        else {
            throw new Error(`Unsupported file format: ${filePath}`);
        }
    }
}
exports.CloudFormationParser = CloudFormationParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsZ0NBQWdDO0FBZ0JoQzs7R0FFRztBQUNILE1BQWEsb0JBQW9CO0lBQy9COzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBZ0I7UUFDdEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFbEQsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDL0IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBMkIsQ0FBQztRQUN2RCxDQUFDO2FBQU0sSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNuRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUEyQixDQUFDO1FBQ3RELENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUMxRCxDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBaEJELG9EQWdCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHlhbWwgZnJvbSAnanMteWFtbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRGb3JtYXRpb25UZW1wbGF0ZSB7XG4gIEFXU1RlbXBsYXRlRm9ybWF0VmVyc2lvbj86IHN0cmluZztcbiAgRGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIFBhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBSZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIENsb3VkRm9ybWF0aW9uUmVzb3VyY2U+O1xuICBPdXRwdXRzPzogUmVjb3JkPHN0cmluZywgYW55Pjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbG91ZEZvcm1hdGlvblJlc291cmNlIHtcbiAgVHlwZTogc3RyaW5nO1xuICBQcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBEZXBlbmRzT24/OiBzdHJpbmcgfCBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBwYXJzZXJcbiAqL1xuZXhwb3J0IGNsYXNzIENsb3VkRm9ybWF0aW9uUGFyc2VyIHtcbiAgLyoqXG4gICAqIFBhcnNlIGEgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgZnJvbSBhIGZpbGVcbiAgICogQHBhcmFtIGZpbGVQYXRoIFBhdGggdG8gdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIGZpbGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2VGaWxlKGZpbGVQYXRoOiBzdHJpbmcpOiBDbG91ZEZvcm1hdGlvblRlbXBsYXRlIHtcbiAgICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpO1xuICAgIFxuICAgIGlmIChmaWxlUGF0aC5lbmRzV2l0aCgnLmpzb24nKSkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoY29udGVudCkgYXMgQ2xvdWRGb3JtYXRpb25UZW1wbGF0ZTtcbiAgICB9IGVsc2UgaWYgKGZpbGVQYXRoLmVuZHNXaXRoKCcueWFtbCcpIHx8IGZpbGVQYXRoLmVuZHNXaXRoKCcueW1sJykpIHtcbiAgICAgIHJldHVybiB5YW1sLmxvYWQoY29udGVudCkgYXMgQ2xvdWRGb3JtYXRpb25UZW1wbGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBmaWxlIGZvcm1hdDogJHtmaWxlUGF0aH1gKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==