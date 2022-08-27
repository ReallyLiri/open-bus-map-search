docker run --rm \
  -v ${PWD}:/local openapitools/openapi-generator-cli generate \
  -i https://open-bus-stride-api.hasadna.org.il/openapi.json \
  -g typescript-axios \
  --remove-operation-id-prefix \
  -o /local/stride-api