# AWS SAM demo: Click tracker

Please refer to the AWS Serverless Application Model documentation https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html

**deploy the project**
```
# you should have valid AWS credentials on your environment (install the aws cli and run aws configure)
sam build
sam deploy --guided
```

**run locally**
```
# should autoreload automatically
sam local start-api 
```

![Polytech - Day 2 - ClickTracker architecture (1)](https://user-images.githubusercontent.com/1446201/112993757-66857200-911e-11eb-98e4-9e187e391b77.png)

The ElasticSearch domain is assumed to already exist
