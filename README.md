# Eventbridge API Destination example
  A simple lambda function that gets invoked by API Gateway, and adds user data to dynamo db and send event to
  eventbridge that invokes API Destinations which sends an email using sendgrid rest API.