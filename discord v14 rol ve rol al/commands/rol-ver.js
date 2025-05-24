const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { roleAction } = require('../utils/roleManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rol-ver')
    .setDescription('Belirtilen rolü kullanıcı(lar)a verir')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Verilecek rol')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('hedef')
        .setDescription('Rolü kime/kimlere verecek?')
        .setRequired(true)
        .addChoices(
          { name: 'kullanıcı', value: 'user' },
          { name: 'Herkese', value: 'everyone' }
        ))
    .addUserOption(option =>
      option.setName('kullanici')
        .setDescription('Rol verilecek kullanıcı')
        .setRequired(false)),
  
  async execute(interaction) {
    await roleAction(interaction, 'add');
  }
};