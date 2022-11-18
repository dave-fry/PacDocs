# Monitoring

[Azure Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
is used for application monitoring. This can be used to track any exceptions or dependency failures that occur,
and monitor application performance.

All backend logging statements are sent to Application Insights.

## Status endpoint

The API exposes a healthcheck endpoint at `/api/status` - it will return a 200 response if the API is running
and can connect to the database.

## Data cap

Application Insights gives 5GB of data ingestion per month for free. To avoid running over the cap,
a daily data cap can be sent through the Azure Portal.

We have set the daily cap to 100MB on each test environment to keep the test environment total within
the monthly limit.
