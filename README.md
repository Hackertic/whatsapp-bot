# WhatsApp Bot

This bot includes the following functionalities:
- **Antilink**: Block and remove links from group chats.
- **Antiword**: Block specific words in group chats.
- **Warn**: Warn users for sending links and kick them out after 3 warnings.
- **Hidetag**: Tag all users in the group without them seeing the tagged users.
- **Greetings**: Send a greeting message to new group members.

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up your `.env` file for session and other sensitive data.
4. Run `npm start` to start the bot.

## Commands

- `.Antilink on/off`: Enable or disable the anti-link feature.
- `.Antiword [list of words]`: Define words to block in the group.
- `.warn`: Warn users who send links.
- `.Hidetag`: Tag all members in the group (without showing the tags).
- `.Greetings on/off`: Enable or disable greeting messages.

## License
This project is licensed under the MIT License - see the LICENSE file for details.