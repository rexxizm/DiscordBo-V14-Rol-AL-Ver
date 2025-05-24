const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { roleAction } = require('../utils/roleManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rol-al')
    .setDescription('Belirtilen rolü kullanıcı(lar)dan alır')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Alınacak rol')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('hedef')
        .setDescription('Rolü kime/kimlerden alacak?')
        .setRequired(true)
        .addChoices(
          { name: 'Kullanıcı', value: 'user' },
          { name: 'Herkesten', value: 'everyone' }
        ))
    .addUserOption(option =>
      option.setName('kullanici')
        .setDescription('Rol alınacak kullanıcı')
        .setRequired(false)),
  
  async execute(interaction) {
    await roleAction(interaction, 'remove');
  }
};