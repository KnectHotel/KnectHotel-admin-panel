
const S3_BASE = 'https://dibstestbucket0403.s3.ap-south-1.amazonaws.com';

export const keyToUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\
  return `${S3_BASE}/${value.replace(/^\/+/, '')}`;
};
