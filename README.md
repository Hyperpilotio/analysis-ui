
# Analysis UI

Hyperpilot Analysis UI (based on Segment's Spec) is designed to show analaysis results of a cluster

## Docker

## Development

To develop, you'll first need to install [node][node]. Then, you can run the server and client builders, both of which will watch for changes and hot-reload.

In one terminal window (which has your AWS credentials exported), run the following:

    $ make server

In another, do:

    $ make dev-server


Now visit [http://localhost:3001/](http://localhost:3001/) =)

[ecs]: https://aws.amazon.com/ecs/
[node]: https://nodejs.org/en/
