"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdktf_1 = require("cdktf");
const aws = require("@cdktf/provider-aws");
class MyStack extends cdktf_1.TerraformStack {
    constructor(scope, id, props) {
        var _a;
        super(scope, id);
        this.BucketName = (_a = props === null || props === void 0 ? void 0 : props.BucketName) !== null && _a !== void 0 ? _a : "my-sample-bucket";
        // Define AWS provider
        new aws.AwsProvider(this, "aws", {
            region: "us-west-2", // Change as needed
        });
        // Define resources
        const mys3bucket = new aws.AwsS3Bucket(this, "mys3bucket", {
            _bucket_name: props.BucketName,
            _access_control: "Private",
            _versioning_configuration: { "_status": "Enabled" },
            _tags: [{ "_key": "Environment", "_value": "Development" }],
        });
        // Define outputs
        new cdktf_1.TerraformOutput(this, "BucketArn", {
            value: mys3bucket._arn,
            description: "ARN of the S3 bucket",
        });
        new cdktf_1.TerraformOutput(this, "BucketName", {
            value: "mys3bucket",
            description: "Name of the S3 bucket",
        });
    }
}
const app = new cdktf_1.App();
new MyStack(app, "converted-stack", {
// Provide values for required variables
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBNkQ7QUFDN0QsMkNBQTJDO0FBTTNDLE1BQU0sT0FBUSxTQUFRLHNCQUFjO0lBR2xDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBbUI7O1FBQzNELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxVQUFVLG1DQUFJLGtCQUFrQixDQUFDO1FBRTFELHNCQUFzQjtRQUN0QixJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUMvQixNQUFNLEVBQUUsV0FBVyxFQUFFLG1CQUFtQjtTQUN6QyxDQUFDLENBQUM7UUFFSCxtQkFBbUI7UUFDbkIsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDekQsWUFBWSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzlCLGVBQWUsRUFBRSxTQUFTO1lBQzFCLHlCQUF5QixFQUFFLEVBQUMsU0FBUyxFQUFDLFNBQVMsRUFBQztZQUNoRCxLQUFLLEVBQUUsQ0FBQyxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsUUFBUSxFQUFDLGFBQWEsRUFBQyxDQUFDO1NBQ3ZELENBQUMsQ0FBQztRQUVILGlCQUFpQjtRQUNqQixJQUFJLHVCQUFlLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNyQyxLQUFLLEVBQUUsVUFBVSxDQUFDLElBQUk7WUFDdEIsV0FBVyxFQUFFLHNCQUFzQjtTQUNwQyxDQUFDLENBQUM7UUFFSCxJQUFJLHVCQUFlLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUN0QyxLQUFLLEVBQUUsWUFBWTtZQUNuQixXQUFXLEVBQUUsdUJBQXVCO1NBQ3JDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksV0FBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLGlCQUFpQixFQUFFO0FBQ2xDLHdDQUF3QztDQUN6QyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgQXBwLCBUZXJyYWZvcm1TdGFjaywgVGVycmFmb3JtT3V0cHV0IH0gZnJvbSBcImNka3RmXCI7XG5pbXBvcnQgKiBhcyBhd3MgZnJvbSBcIkBjZGt0Zi9wcm92aWRlci1hd3NcIjtcblxuaW50ZXJmYWNlIE15U3RhY2tQcm9wcyB7XG4gIEJ1Y2tldE5hbWU/OiBzdHJpbmc7XG59XG5cbmNsYXNzIE15U3RhY2sgZXh0ZW5kcyBUZXJyYWZvcm1TdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBCdWNrZXROYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE15U3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLkJ1Y2tldE5hbWUgPSBwcm9wcz8uQnVja2V0TmFtZSA/PyBcIm15LXNhbXBsZS1idWNrZXRcIjtcblxuICAgIC8vIERlZmluZSBBV1MgcHJvdmlkZXJcbiAgICBuZXcgYXdzLkF3c1Byb3ZpZGVyKHRoaXMsIFwiYXdzXCIsIHtcbiAgICAgIHJlZ2lvbjogXCJ1cy13ZXN0LTJcIiwgLy8gQ2hhbmdlIGFzIG5lZWRlZFxuICAgIH0pO1xuXG4gICAgLy8gRGVmaW5lIHJlc291cmNlc1xuICAgIGNvbnN0IG15czNidWNrZXQgPSBuZXcgYXdzLkF3c1MzQnVja2V0KHRoaXMsIFwibXlzM2J1Y2tldFwiLCB7XG4gICAgICBfYnVja2V0X25hbWU6IHByb3BzLkJ1Y2tldE5hbWUsXG4gICAgICBfYWNjZXNzX2NvbnRyb2w6IFwiUHJpdmF0ZVwiLFxuICAgICAgX3ZlcnNpb25pbmdfY29uZmlndXJhdGlvbjoge1wiX3N0YXR1c1wiOlwiRW5hYmxlZFwifSxcbiAgICAgIF90YWdzOiBbe1wiX2tleVwiOlwiRW52aXJvbm1lbnRcIixcIl92YWx1ZVwiOlwiRGV2ZWxvcG1lbnRcIn1dLFxuICAgIH0pO1xuXG4gICAgLy8gRGVmaW5lIG91dHB1dHNcbiAgICBuZXcgVGVycmFmb3JtT3V0cHV0KHRoaXMsIFwiQnVja2V0QXJuXCIsIHtcbiAgICAgIHZhbHVlOiBteXMzYnVja2V0Ll9hcm4sXG4gICAgICBkZXNjcmlwdGlvbjogXCJBUk4gb2YgdGhlIFMzIGJ1Y2tldFwiLFxuICAgIH0pO1xuXG4gICAgbmV3IFRlcnJhZm9ybU91dHB1dCh0aGlzLCBcIkJ1Y2tldE5hbWVcIiwge1xuICAgICAgdmFsdWU6IFwibXlzM2J1Y2tldFwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiTmFtZSBvZiB0aGUgUzMgYnVja2V0XCIsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IE15U3RhY2soYXBwLCBcImNvbnZlcnRlZC1zdGFja1wiLCB7XG4gIC8vIFByb3ZpZGUgdmFsdWVzIGZvciByZXF1aXJlZCB2YXJpYWJsZXNcbn0pO1xuYXBwLnN5bnRoKCk7XG4iXX0=