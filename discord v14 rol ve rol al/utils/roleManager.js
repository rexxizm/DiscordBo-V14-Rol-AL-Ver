const { PermissionFlagsBits } = require('discord.js');

async function roleAction(interaction, action) {
  const role = interaction.options.getRole('rol');
  const target = interaction.options.getString('hedef');
  const user = interaction.options.getUser('kullanici');
  const actionText = action === 'add' ? 'verme' : 'alma';
  const successText = action === 'add' ? 'verildi' : 'alındı';

  if (role.position >= interaction.guild.members.me.roles.highest.position) {
    return interaction.reply({
      content: `Bu rolü ${actionText} işlemi yapamam çünkü benim en yüksek rolümden daha yüksek veya eşit.`,
      ephemeral: true
    });
  }

  if (target === 'user') {
    if (!user) {
      return interaction.reply({
        content: 'Bir kullanıcı belirtmelisiniz!',
        ephemeral: true
      });
    }

    try {
      const member = await interaction.guild.members.fetch(user.id);
      
      if (action === 'add' && member.roles.cache.has(role.id)) {
        return interaction.reply({
          content: 'Bu kullanıcı zaten bu role sahip!',
          ephemeral: true
        });
      }
      if (action === 'remove' && !member.roles.cache.has(role.id)) {
        return interaction.reply({
          content: 'Bu kullanıcı zaten bu role sahip değil!',
          ephemeral: true
        });
      }

      await member.roles[action](role);
      return interaction.reply({
        content: `${role.name} rolü ${user.tag} kullanıcısından başarıyla ${successText}!`,
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: `Rol ${actionText} işlemi sırasında bir hata oluştu!`,
        ephemeral: true
      });
    }
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const members = await interaction.guild.members.fetch();
    const humanMembers = members.filter(m => !m.user.bot);
    const totalMembers = humanMembers.size;
    let processed = 0;
    let skipped = 0;
    let errors = 0;

    for (const [, member] of humanMembers) {
      try {
        const hasRole = member.roles.cache.has(role.id);
        if ((action === 'add' && hasRole) || (action === 'remove' && !hasRole)) {
          skipped++;
          continue;
        }

        await member.roles[action](role);
        processed++;
      } catch (err) {
        errors++;
        console.error(`${member.user.tag} kullanıcısında işlem başarısız:`, err);
      }
      if (processed % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return interaction.editReply({
      content: `Toplu rol ${actionText} işlemi tamamlandı!\n` +
               `Başarılı: ${processed}\n` +
               `Atlanan: ${skipped}\n` +
               `Hatalı: ${errors}\n` +
               `Toplam: ${totalMembers}`,
      ephemeral: true
    });
  } catch (error) {
    console.error(`Toplu rol ${actionText} işleminde hata:`, error);
    return interaction.editReply({
      content: `Toplu rol ${actionText} işlemi sırasında bir hata oluştu!`,
      ephemeral: true
    });
  }
}

module.exports = { roleAction };