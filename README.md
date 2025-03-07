## Tank Data Polller (Name is WIP)

### Parts of the system

- postgres docker container to hold historical data
- postgres setup files found in /postgres
- node js scripts for interacting with the system in /scripts
  - Most scripts don't do anything special they just make common actions easier
  - The main.js script is used by cron to periodically poll and apex systems in the database and inject the readings into the database

### Postgres

You can use any postgres instance you want. I have included the Dockerfile that I used to set mine up just to show you how bare bones it is. Nothing too special needed here.

#### Roles

There are 3 roles that I have setup on my postgres instances

##### postgres (default):

This role is the catch all role. It's the default postgres role that is on every postgres instance. I use it to run the setup scripts, maintain the database if anything goes wrong and that's about it.

##### tank_data_injector:

In the setup sql script, I create a user called `tank_data_injector`. This users only job is to be used by the cron job and the main.js script to pull data from apex machines and put it into the database. It has usage permissions on the parameter_reading tables sequence, insert permissions on the parameter_reading table and select permissions on the other tables so it can read to get the right id values. This is not a general purpose user and should only be used by the cron job. Otherwise, you will likely run into permissions issues

##### dashboard_user:

In the setup sql script, I create a user called `dashboard_user`. This users only job is to be used by my Grafana instance so that it can generate a dashboard for me to view all the data on in graph form. Think of it as a readOnly user to be used by Grafana so Grafana can't possibly mess things up.

#### Schema

The tables used by this system are stored in a schema called `tank_data_schema`. I mostly do this to keep tables out of the `public` schema as it seems like a good idea :shrugs:

### Setup

In order to get everything up and running well, you will have to do a few things.

Edit: I have created a compose.yaml file for docker compose to make setup easier

#### Postgres

- Install docker
- Use the included Dockerfile to setup a postgres instance
- Run the setup script in the postgres folder
- You will then have to create parameters and tanks in the database. See the inject script in the postgres folder to see and example
- You will likely have to go into the `usePgClient.js` file and set some parameters in there to point to your postgres instance

#### Grafana

- I created a Grafana dashboard by adding a datasource pointed at my postgres instance and then created some time series graphs to show my parameter reading data at a quick glance. Instructions are vague because it's setup quick and dirty and I haven't documented any of it yet. Maybe in the future :shrugs: feel free to reach out to me if you have questions. Warning though, I may or may not answer depending if I'm still working on this project or not and see your message.
