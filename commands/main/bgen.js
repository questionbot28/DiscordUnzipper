const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');

const generated = new Set();

module.exports = {
  name: 'bgen',
  description: 'Generate a specified service if stocked (basic)',
  usage: 'bgen <service>',

  execute(message, args, usedPrefix) {
    try {
      message.client.channels.cache.get(config.basichannelid).id;
    } catch (error) {
      if (error) {
        console.error(error);
      }

      if (config.command.error_message === true) {
        return message.channel.send(
          new MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Error occurred!')
            .setDescription('Not a valid basichannel specified!')
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
      } else {
        return;
      }
    }

    if (message.channel.id === config.basichannelid) {
      if (generated.has(message.author.id)) {
        return message.channel.send(
          new MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Cooldown!')
            .setDescription(`Please wait **${config.bgenCooldown / 60000}m** before executing that command again!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
      } else {
        const service = args[0];

        if (!service) {
          return message.channel.send(
            new MessageEmbed()
              .setColor(config.color.red)
              .setTitle('Missing parameters!')
              .setDescription('You need to give a service name!')
              .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
              .setTimestamp()
          );
        }

        const filePath = `${__dirname}/../../basicstock/${args[0]}.txt`;

        fs.readFile(filePath, function (error, data) {
          if (!error) {
            data = data.toString();

            const position = data.toString().indexOf('\n');
            const firstLine = data.split('\n')[0];

            if (position === -1) {
              return message.channel.send(
                new MessageEmbed()
                  .setColor(config.color.red)
                  .setTitle('Generator error!')
                  .setDescription(`I do not find the \`${args[0]}\` service in my basicstock!`)
                  .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                  .setTimestamp()
              );
            }

            const generatedCode = firstLine; // Save the generated code

            const currentTime = new Date();
            const formattedTime = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1)
              .toString()
              .padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')} ${
              currentTime.getHours().toString().padStart(2, '0')
            }:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`;



         
          
        




            
            const redemptionEmbed = new MessageEmbed()
              .setColor(config.color.green)
              .setTitle('NEXUS G3N')
              .setDescription('**Follow these steps to redeem your code:**\nStep 1: Click on this [LINK](https://linkvertise.com/1095610/veify-to-claim-rewards?o=sharing) , complete some steps and register with your Discord nickname.\nStep 2: Go to the Ticket channel\nStep 3: Click on Redeem a code\nStep 4: Send this code to staff:')
              .addField('Code', `\`\`\`${generatedCode}\`\`\``)
              .setFooter(`Generated by NEXUS G3N • ${formattedTime}`);

            // DM the user with the embed
            message.author.send(redemptionEmbed).catch((err) => {
              console.error(`Failed to send DM to ${message.author.tag}: ${err}`);
            });

            // Save the code to redeemcodes.txt with the service name
            const redeemFilePath = `${__dirname}/../../redeemcodes/redeemcodes.txt`;
            fs.appendFileSync(redeemFilePath, `${generatedCode} - ${service} in basic category\n`);

            if (position !== -1) {
              data = data.substr(position + 1);

              fs.writeFile(filePath, data, function (error) {
                message.channel.send(
                  new MessageEmbed()
                    .setColor(config.color.green)
                    .setTitle('Account generated successfully!')
                    .setDescription(`Check your private ${message.author}! If you do not receive the message, please unlock your private!`)
                    .setImage(config.gif) // Use the URL from config.json
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );

                generated.add(message.author.id);

                setTimeout(() => {
                  generated.delete(message.author.id);
                }, config.bgenCooldown * 60 * 1000);

                if (error) {
                  console.error(error);
                }
              });
            } else {
              return message.channel.send(
                new MessageEmbed()
                  .setColor(config.color.red)
                  .setTitle('Generator error!')
                  .Description(`The \`${args[0]}\` service is empty!`)
                  .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                  .setTimestamp()
              );
            }
          } else {
            return message.channel.send(
              new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Generator error!')
                .setDescription(`Service \`${args[0]}\` does not exist!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
          }
        });
      }
    } else {
      message.channel.send(
        new MessageEmbed()
          .setColor(config.color.red)
          .setTitle('Wrong command usage!')
          .setDescription(`You cannot use the \`bbgen\` command in this channel! Try it in <#${config.basichannelid}>!`)
          .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
          .setTimestamp()
      );
    }
  },
};
