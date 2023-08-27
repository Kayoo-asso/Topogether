FROM gitpod/workspace-node-lts

RUN sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl gnupg \
    && curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | sudo apt-key add - \
    && echo "deb https://packages.doppler.com/public/cli/deb/debian any-version main" | sudo tee /etc/apt/sources.list.d/doppler-cli.list \
    && sudo apt-get update \
    && sudo apt-get install -y doppler