const CONTENT_TYPE = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
}

function validateContentType(ctx, type = 'json') {
  let contentType = ctx.request.header['content-type']
  if (type === 'json') {
    return contentType.indexOf(CONTENT_TYPE.JSON) > -1
  }
  if (type === 'form') {
    return contentType.indexOf(CONTENT_TYPE.FORM) > -1
  }
}

module.exports = {
  validateContentType
}