eth tracker utility

This simple utility tracks account ETH balance and notifies channel in Discord using a discord bot.

This utility can handle multiple addresses at once.

General workflow of various components are listed 
![here](https://user-images.githubusercontent.com/3907463/173174004-8ee6b255-8acd-4208-9e29-756c65ab78c4.png)


### API handler
User/Admin can start the deamon using API endpoint with required input data.

```
    {scheme}:{host}:{port}/start
```

```
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
