# AWS S3 Setup Guide for Training Logs

This guide walks you through setting up an AWS S3 bucket for storing training session logs.

## Prerequisites

- An AWS account
- AWS CLI installed (optional but recommended)
- IAM user with appropriate permissions

---

## Step 1: Create an S3 Bucket

### Via AWS Console

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/s3/)
2. Click **Create bucket**
3. Configure the bucket:
   - **Bucket name**: `your-company-training-logs` (must be globally unique)
   - **Region**: Choose your preferred region (e.g., `us-east-1`)
   - **Object Ownership**: ACLs disabled (recommended)
   - **Block Public Access**: Keep all options **enabled** (private bucket)
   - **Versioning**: Enable (recommended for data protection)
   - **Encryption**: Enable server-side encryption with Amazon S3 managed keys (SSE-S3)
4. Click **Create bucket**

### Via AWS CLI

```bash
aws s3 mb s3://your-company-training-logs --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket your-company-training-logs \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket your-company-training-logs \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

---

## Step 2: Create an IAM User for the Application

### Via AWS Console

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. User name: `training-logs-app`
4. Select **Access key - Programmatic access**
5. Click **Next: Permissions**
6. Click **Attach policies directly**
7. Click **Create policy** and use the JSON below

### IAM Policy (Least Privilege)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "TrainingLogsUpload",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::your-company-training-logs/training-logs/*"
    },
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::your-company-training-logs",
      "Condition": {
        "StringLike": {
          "s3:prefix": "training-logs/*"
        }
      }
    }
  ]
}
```

### Create Access Keys

1. After creating the user, go to **Security credentials**
2. Click **Create access key**
3. Select **Application running outside AWS**
4. Save the **Access Key ID** and **Secret Access Key** securely

---

## Step 3: Configure Environment Variables

Add the following to your `.env` file:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIA...your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-company-training-logs
```

> ⚠️ **Security Note**: Never commit these credentials to version control. Use environment variables or a secrets manager in production.

---

## Step 4: Configure Lifecycle Rules (Cost Optimization)

Set up lifecycle rules to automatically transition old logs to cheaper storage classes or delete them.

### Via AWS Console

1. Go to your bucket → **Management** tab
2. Click **Create lifecycle rule**
3. Configure:
   - **Rule name**: `training-logs-lifecycle`
   - **Prefix**: `training-logs/`
   - **Transitions**:
     - Move to S3 Standard-IA after 30 days
     - Move to S3 Glacier after 90 days
   - **Expiration**: Delete after 365 days (optional)

### Via AWS CLI

```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket your-company-training-logs \
  --lifecycle-configuration '{
    "Rules": [{
      "ID": "training-logs-lifecycle",
      "Status": "Enabled",
      "Filter": { "Prefix": "training-logs/" },
      "Transitions": [
        { "Days": 30, "StorageClass": "STANDARD_IA" },
        { "Days": 90, "StorageClass": "GLACIER" }
      ],
      "Expiration": { "Days": 365 }
    }]
  }'
```

---

## Step 5: Enable Bucket Logging (Optional)

For audit purposes, you can enable access logging:

1. Create a separate bucket for logs: `your-company-training-logs-access-logs`
2. Enable logging on the main bucket pointing to this bucket

---

## Best Practices

### Security

- ✅ Use IAM roles instead of access keys when running on AWS infrastructure
- ✅ Enable bucket versioning for data protection
- ✅ Block all public access
- ✅ Enable server-side encryption
- ✅ Use least-privilege IAM policies
- ✅ Rotate access keys regularly

### Cost Optimization

- ✅ Use lifecycle rules to transition to cheaper storage classes
- ✅ Set expiration policies for old logs
- ✅ Monitor storage usage with AWS Cost Explorer

### Organization

- ✅ Use consistent key naming: `training-logs/{year}/{month}/{session-id}.log`
- ✅ Use tags for cost allocation and organization
- ✅ Consider separate buckets for dev/staging/production

---

## Troubleshooting

### Error: Access Denied

1. Check IAM policy is attached to the user
2. Verify bucket name in policy matches actual bucket
3. Check the `Resource` ARN includes the correct path pattern

### Error: Bucket Does Not Exist

1. Verify bucket name in `.env` is correct (case-sensitive)
2. Check the bucket is in the correct AWS region

### Error: Invalid Credentials

1. Verify access key ID and secret are correct
2. Check the access key hasn't been deactivated
3. Ensure there are no extra spaces in the `.env` values

---

## Log File Structure

Logs are uploaded with the following S3 key format:

```
training-logs/{year}/{month}/{session-id}.log
```

Example:

```
training-logs/2024/03/abc12345-def6-7890-ghij-klmn12345678.log
```

Each log file contains JSON with:

- Session metadata (ID, timestamps, version)
- User information (username, session start time)
- Pod details (ID, GPU type, cost)
- Training configuration (epochs, batch size, etc.)
- Training results (duration, checkpoints saved)
