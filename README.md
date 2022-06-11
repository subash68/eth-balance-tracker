# eth tracker utility

This simple utility tracks account ETH balance and notifies channel in Discord using a discord bot. This utility can track multiple addresses at once.

General workflow of various components are listed 
![eith-balance-tracker](https://user-images.githubusercontent.com/3907463/173186367-210e26dd-b2ed-43e7-af62-a1f67c6cf562.png)


## API handler

User/Admin can use this REST API to update configuration for the deamon running. User/Admin can start the deamon using API endpoint with required input data.

To start the daemon:
```
    {schema}:{host}:{port}/v1/track/start

    {
        "name": "default"
    }
```
> for default configuration

To update configuration into persistent storage (mongodb).


```
    {schema}:{host}:{port}/v1/track/start

    {
        "addresses": [
                "0x4db8bcCF4385C7AA46F48eb42f70FA41Df917b44",
                "0x287f0B854a2Ba9Dc3E8572c68bDabD949819F119",
                "0xEab2B6b5a76d5878a7B5D97d7F6812Da09A30953"
            ],
        "minimum": 0.5,
        "frequency": "At 9"
    }
```

> configurations at this point are stored in-memory
> they can stored in persistent datastore i.e. mongodb

## Transaction tracker

Tracker connects to node provider and watches for any **outgoing transactions** from provided address to watch. If there are any confirmed transactions from addresses in watchlist, its remaining balance will be reported in discord channel.

## Discord bot

Bot handler will broadcast messages to selected channel in the server. sample discord messages would look like

![Screen Shot 2022-06-11 at 11 04 02](https://user-images.githubusercontent.com/3907463/173174390-f8c45c08-d307-4dc5-806f-9902d5c75986.png)

> If account maintains sufficient balance then its tagged with green color else tagged with red color.

## Cron job handler

A corn job handler is provided to track balance of all addresses at a specific time or at specific intervals. User input is collected as simple time input and converted into cron time format. In our case, we are tracking all the addresses **At 09:00** everyday.

```
    0 0 9 * * *
```

> cron time conversion utility is currently under development. Will update this repo lately.

## Blockchain nodes

We are tracking addresses from Avalanche blockchain, for which we are using speedy nodes provided by **moralis** to connect with our blockchain network. 

> Node configurations are maintained in .env file. 
> .env.example file is provided for bringing up this service with ease.

## Deployment strategy

Deployement strategy for this deamon with multiple endpoint configuation for messaging services can be hosted in AWS. General architecture for deployement 
![eth-balance-tracker-deployment](https://user-images.githubusercontent.com/3907463/173186377-2294a3e1-30cb-4e52-afe3-eeb8861bbb2f.png)

Room For improvements:

1. we could have multiple tracker instances to handle multiple configurations with broadcast endpoints.
2. Configuraitons for multiple endpoints and adding multiple endpoints to deamon.
