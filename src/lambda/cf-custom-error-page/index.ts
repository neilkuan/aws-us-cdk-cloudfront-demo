export async function handler(event: any) {
  // Extract the request from the CloudFront event that is sent to Lambda@Edge

  console.log('Event', event);

  var response = event.Records[0].cf.response;
  /**
    This function updates your HTTP status code in the response to a 404, redirecting it to another path (cache behavior) that has a different origin configured. Note the following:
    1. The function is triggered by an origin response
    2. The response status from the origin server is an error status code (4xx)
   */
  if (Number(response.status) >= 400 && Number(response.status) <= 499) {
    const redirectPath = '/404.html';
    response.status = 302;
    response.statusDescription = 'Found';

    //Drop the body as it is not required for redirects
    response.body = '';
    response.headers.location = [{ key: 'Location', value: redirectPath }];
  };

  console.log(response);
  return response;
}