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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFyc2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUF5QjtBQUN6QixnQ0FBZ0M7QUFnQmhDOztHQUVHO0FBQ0gsTUFBYSxvQkFBb0I7SUFDL0I7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFnQjtRQUN0QyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVsRCxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUMvQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUEyQixDQUFDO1FBQ3ZELENBQUM7YUFBTSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ25FLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQTJCLENBQUM7UUFDdEQsQ0FBQzthQUFNLENBQUM7WUFDTixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzFELENBQUM7SUFDSCxDQUFDO0NBQ0Y7QUFoQkQsb0RBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgeWFtbCBmcm9tICdqcy15YW1sJztcblxuZXhwb3J0IGludGVyZmFjZSBDbG91ZEZvcm1hdGlvblRlbXBsYXRlIHtcbiAgQVdTVGVtcGxhdGVGb3JtYXRWZXJzaW9uPzogc3RyaW5nO1xuICBEZXNjcmlwdGlvbj86IHN0cmluZztcbiAgUGFyYW1ldGVycz86IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIFJlc291cmNlczogUmVjb3JkPHN0cmluZywgQ2xvdWRGb3JtYXRpb25SZXNvdXJjZT47XG4gIE91dHB1dHM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsb3VkRm9ybWF0aW9uUmVzb3VyY2Uge1xuICBUeXBlOiBzdHJpbmc7XG4gIFByb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIERlcGVuZHNPbj86IHN0cmluZyB8IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIHBhcnNlclxuICovXG5leHBvcnQgY2xhc3MgQ2xvdWRGb3JtYXRpb25QYXJzZXIge1xuICAvKipcbiAgICogUGFyc2UgYSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBmcm9tIGEgZmlsZVxuICAgKiBAcGFyYW0gZmlsZVBhdGggUGF0aCB0byB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgZmlsZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwYXJzZUZpbGUoZmlsZVBhdGg6IHN0cmluZyk6IENsb3VkRm9ybWF0aW9uVGVtcGxhdGUge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGY4Jyk7XG4gICAgXG4gICAgaWYgKGZpbGVQYXRoLmVuZHNXaXRoKCcuanNvbicpKSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShjb250ZW50KSBhcyBDbG91ZEZvcm1hdGlvblRlbXBsYXRlO1xuICAgIH0gZWxzZSBpZiAoZmlsZVBhdGguZW5kc1dpdGgoJy55YW1sJykgfHwgZmlsZVBhdGguZW5kc1dpdGgoJy55bWwnKSkge1xuICAgICAgcmV0dXJuIHlhbWwubG9hZChjb250ZW50KSBhcyBDbG91ZEZvcm1hdGlvblRlbXBsYXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZpbGUgZm9ybWF0OiAke2ZpbGVQYXRofWApO1xuICAgIH1cbiAgfVxufVxuIl19