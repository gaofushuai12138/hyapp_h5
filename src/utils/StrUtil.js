const ParseJson = function(str) {
  let json = null
  try {
    json = JSON.parse(str)
  } catch(ex) {
    json = null
  }

  return json
}

export {
  ParseJson
}