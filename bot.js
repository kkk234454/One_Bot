const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
// 색 
const red = botconfig.red;
const green = botconfig.green;
const orange = botconfig.orange;
const cyan = botconfig.cyan;

// ${bot.user.username} 은 봇 이름
// 절대로 bot.user.username 은 변경하면 안됨.
// bot.user.username 은 token 에서 봇의 이름을 자동으로 불러오기 때문에 변경하면 더 악하게 돌아옴.

bot.on("ready", async () => {
  console.log(`${bot.user.username}이 활성화 되었습니다.`);
  console.log(`${bot.user.username}이 ${bot.guilds.size}개의 서버에서 활동 중 입니다.`);

// 사람이 서버에 가입했을 떄
bot.on("guildMemberAdd", async member => {
  console.log(`${member.id}님이 서버에 가입했습니다.`);
// general 채팅방에 남김
  let welcomechannel = member.guild.channels.find(`name`, "general");
  welcomechannel.send(`[ 가입 ] 안녕하세요! ${member}님이 서버에 가입했습니다.`)
});

// 사람이 서버에서 퇴장했을 때
bot.on("guildMemberRemove", async member => {
  console.log(`${member.id}님이 서버에서 나갔습니다.`);
// general 채팅방에 남김.
  let welcomechannel = member.guild.channels.find(`name`, "general");
  welcomechannel.send(`[ 탈퇴 ] 안녕히가세요. **${member}**님이 서버에서 나갔습니다.`)
});

// 채팅방이 생성된 이슈가 발생했을 때
bot.on("channelCreate", async channel => {
  console.log(`${channel.name} 채팅방이 생성되었습니다.`)
// general 채팅방에 남김
  let sChannel = channel.guild.channels.find(`name`, "general");
  sChannel.send(`${channel} 채팅방이 생성되었습니다.`);
});

// 채팅방이 삭제된 이슈가 발생했을 때
bot.on("channelDelete", async channel => {
  console.log(`${channel.name} 채팅방이 삭제되었습니다.`)

  let sChannel = channel.guild.channels.find(`name`, "general");
  sChannel.send(`**${channel.name}** 채팅방이 삭제되었습니다.`);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ 플레이 중
  bot.user.setActivity("SW_Bot| !도움말");
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
//킥
  if(cmd === `${prefix}킥`){

    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
    return message.reply("[ 오류 ] 사유 > **권한 미충족**");
      let member = message.mentions.members.first();
  if(!member)
    return message.reply("[ 오류 ] 사유 > **@ 를 통해 사용자를 지정하시기 바랍니다.**");
  if(!member.kickable)
    return message.reply("[ 오류 ] 사유 > **봇에 관리자 권한이 있는지 확인하여 주세요.**");

  let reason = args.slice(1).join(' ');
  if(!reason)
    return message.reply("[ 오류 ] 사유 > **사용자를 추방하는 이유를 입력하세요.**");
      await member.kick(reason)
    .catch(error => message.reply(`[ 추방 실패 ]\n\n추방 대상 > **${message.author}**\n사유 > **${error}**`));
  message.reply(`[ 추방 완료 ]\n\n추방 대상 > **${member.user.tag}**\n사유 > **${reason}**`);

    }

//밴
if(cmd === `${prefix}밴`){
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
          return message.reply("[ 오류 ] 사유 > **권한 미충족**");

        let member = message.mentions.members.first();
        if(!member)
          return message.reply("[ 오류 ] 사유 > **@ 를 통해 사용자를 지정하시기 바랍니다.**");
        if(!member.bannable)
          return message.reply("[ 오류 ] 사유 > **봇에 관리자 권한이 있는지 확인하여 주세요.**");

        let reason = args.slice(1).join(' ');
        if(!reason)
          return message.reply("[ 오류 ] 사유 > **사용자를 영구추방하는 이유를 입력하세요.**");

        await member.ban(reason)
          .catch(error => message.reply(`[ 영구 추방 실패 ]\n\n영구추방 대상 > **${message.author}**\n사유 > **${error}**`));
        message.reply(`[ 영구 추방 완료 ]\n\n영구추방 대상 > **${member.user.tag}**\n사유 > **${reason}**`);
        }

// 채팅 삭제 명령어
if(cmd === `${prefix}삭제`){
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("삭제를 원하는 줄을 입력하세요. (2-100)\n\n**한번 지운 내용은 복원되지 않습니다.**");
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`[ 오류 ] 사유 > **${error}**\n오류 코드를 kkk234454@naver.com 으로 보내시면 분석 후 회신 해드립니다.`));
    }

    //  서버정보
  if(cmd === `${prefix}서버정보`){

    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setColor("#15f153")
    .setThumbnail(sicon)
    .addField("▶ 서버 이름", message.guild.name)
    .addField("▶ 서버 생성 일자", message.guild.createdAt)
    .addField("▶ 서버에 가입한 일자", message.member.joinedAt)
    .addField("▶ 모든 가입원 수", message.guild.memberCount);

    return message.channel.send(serverembed);
  }

  //  도움말
  if(cmd === `${prefix}도움말`){

    let sicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setColor("#15f153")
    .setThumbnail(sicon)
    .addField("▶일반 봇 명령어", "\n!신고\n!문의\n!업데이트\n!인사말\n!가사\n!SNS[EX.네이버,다음,구글]\n!소식\n!후원")
    .addField("▶음악 명령어", "\n!호랑풍류가 \n !호랑수월가 \n !바람이 되고 싶었던 아이 \n !멜론 \n !Game \n !정지") 
    return message.channel.send(botembed);
  }

  //PUBG봇 도움말
  if(cmd ==='${prefix}도움말2'){

    let sicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setColor("00FFFF")
    .setThumbnail(sicon)
    .addField("▶PUBG 봇 명령어", "!전적 (닉네임) (서버) solo/duo/squad \n EX.!전적 Astrohippo krjp solo ");
  }

// 문의
if(cmd === `${prefix}문의`){
  message.delete();
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return errors.cantfindUser(message.channel);
    let rreason = args.join(" ").slice(22);
    if(!rreason) return errors.noReason(message.channel);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("문의가 접수되었습니다.")
    .setColor(green)
    .addField("채널", message.channel)
    .addField("날짜", message.createdAt)
    .addField("사유", rreason);

    let reportschannel = message.guild.channels.find(`name`, "reports");
    if(!reportschannel) return message.channel.send("문의 로그를 저장하는 채널을 찾지 못하거나, 권한이 없습니다.\n**reports** 텍스트 채널을 생성하고 다시 시도하세요.");
    reportschannel.send(reportEmbed);
    }

    // 신고 
if(cmd === `${prefix}신고`){
  message.delete();
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return errors.cantfindUser(message.channel);
    let rreason = args.join(" ").slice(22);
    if(!rreason) return errors.noReason(message.channel);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("신고가 접수되었습니다.")
    .setColor(red)
    .addField("신고 당한 사람", `닉네임: ${rUser}\n아이디: ${rUser.id}`)
    .addField("제보자", `닉네임: ${message.author}\n아이디: ${message.author.id}`)
    .addField("채널", message.channel)
    .addField("날짜", message.createdAt)
    .addField("사유", rreason);

    let warningchannel = message.guild.channels.find(`name`, "warning");
    if(!warningchannel) return message.channel.send("신고 로그를 저장하는 채널을 찾지 못하거나, 권한이 없습니다.\n**warning** 텍스트 채널을 생성하고 다시 시도하세요.");
    warningchannel.send(reportEmbed);
    }

// !공지 명령어랑 비슷한거임
// 지랄할때는 최고!
if(cmd === `${prefix}공지`){
  message.delete();
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
    let botmessage = args.join(" ");
    message.channel.send(botmessage);
    }

// 서버 정보를 넘어 봇의 정보까지 표시함!
// 개꿀이지 않음?
  if(cmd === `${prefix}정보`){

    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setColor("#15f153")
    .setThumbnail(bicon)
    .addField("▶ 봇 이름", bot.user.username)
    .addField("▶ 생성 일자", bot.user.createdAt);

    return message.channel.send(botembed);
  }

  if(cmd === `${prefix}인사말`){
    const m = await message.channel.send("불러오는 중..");
    m.edit(`안녕하세요 , \n 봇을 개발하게된 허상재 입니다 :) \n\n (뮤직 봇 제작에 도움을 준 **유난**에게 감사를 표합니다)`);
  }
  if(cmd === `${prefix}홈페이지`) {
    const m = await message.channel.send("나와 호랑이님 페이스북 링크를 띄우겠습니다 !");
    m.edit(`https://abh.kr/YB`);
  }


  if(cmd === `${prefix}소식`) {
    const m = await message.channel.send("이번달 시드노벨의 소식을 불러오는 중입니다..");
    m.edit('=======================\n\n5월 시드노벨 소식 \n\n=======================\n\n  **5월 발매작** \n\n **시드노벨** \n 1. <나와 호랑이님(ver.소설)> - 18권 \n 2. <무림 여학원> - 1권 \n\n **시드북스** \n <귀환자의 마법은 특별해야합니다.> - 5권 \n\n 시드노벨 : http://seednovel.com/main.php ');
  }
  if(cmd === `${prefix}규칙`) {
    const m = await message.channel.send("규칙을 불러오는 중 ..");
    m.edit('(1) 기본 규칙 \n\n   ㄱ. 디스코드 서버 내에서 싸움이나 언어폭력 , 성희롱 등등의 문제가 되는 발언시에 경고 1회 \n    ㄴ. 이미지 전송은 가능하나 , 직접적인 수위를 넘어서면 가차없이 **강퇴** \n\n (2) 서버 작동 시간 \n\n    ㄱ. 24시간 동안 봇이 가동되며, 2주에 1번씩 서버 재부팅을 합니다. \n\n (3) 보이스 채널의 이용 \n\n    ㄱ. 생성된 보이스 채널은 누구나 이용이 가능하지만 , 같이 게임을 하는동안에 실력이나 기타 이유때문에 분쟁 발생시 해당 채널을 삭제하겠습니다. \n     ㄴ. 실력이 딸린다고 비판시 강퇴입니다.');
  }
  if(cmd === `${prefix}업데이트`) {
    const m = await message.channel.send("이번달 업데이트 내용 불러오는 중 ..");
    m.edit('**2018년 04월 27일 기준 업데이트 내역** \n\n  1. 멜론 차트 수정  ');
  }
  if(cmd === `${prefix}네이버`) {
    const m = await message.channel.send("네이버 접속 중 ..");
    m.edit('http://naver.com');
  }
  if(cmd === `${prefix}가사`) {
    const m = await message.channel.send("No Game No Life ZERO OST - There is a reason");
    m.edit('    No Game No Life ZERO OST - There is a reason    \n\n どこから話せばいいんだろう \n 어디서부터 말하면 되는걸까 \n 待ちくたびれても \n 기다리다 쓰러져도 \n 終わりだなんて言わせないから \n 끝이라고는 말하게 하지 않을거니까 \n 書きなぐった無意識の衝動をつれて \n 휘갈겨 쓴 무의식의 충동을 데리고 \n 何もかも壊したら \n 무엇이든지 부순다면  \n 不可能を始めればいいんだ \n 불가능을 시작하게 하면 될뿐이야 \n There’s a reason that we came across in this world \n 우리가 이세상을 우연히 만난 것에는 이유가 있어 \n There’s a reason that we caught the magnetic wave \n 우리가 서로 끌어당기는 것에는 이유가 있어 \n 傷つけ合う世界はどこへ \n 상처입었던 세상은 어디에 \n So 愛のために泣けるのは  \n 그래서 사랑을 위해 우는 것은 \n 君がそこにいるから \n 너가 거기에 있으니까\n 君だけを呼び続けるから  \n 너 하나만 계속 부르니까 \n 愛のために歌うのは\n 사랑을 위해 노래하는것은\n そして共に生き抜く事\n 그리고 같이 살아가기 위해\n ずっと 君と\n 계속 너와\n 青色した空と\n 파란색을 띈 하늘과\n 波ひとつない鏡のような\n 흠집이 하나도 없는 거울과 같은\n 海を見てた\n 바다를 보고있었어\n どんな場所にいたって\n 어떤 장소에 있더라도\n どんな形になって\n 어떤 형태가 되었어도\n どんな時代にいたって\n 어떤 시대에 있더라도\n 見つけだす\n 찾아낼거야\n じゃあ、やりますか？\n 그럼 시작할까요?\n 宙吊りにした運命に逆らって\n 공중에 매단 운명을 거역하고\n There’s a reason that we came across in this world\n 우리가 이세상을 우연히 만난 것에는 이유가 있어\n There’s a reason that we caught the magnetic wave\n 우리가 서로 끌어 당기는 것에는 이유가 있어\n 引きよせあう二\n 서로 끌어당기는 둘은 어디에\n So 愛のために進むのは\n 그래서 사랑을 위해 나아가\n 너와 여기에 있으니까\n 僕だけが君を守るから\n 나만이 널 지키니까\n 愛のために願うのは\n 사랑을 위해 비는것은\n そして誰も傷つけずに\n 그리고 누구도 상처받지않게\n ずっと となりで\n 계속 옆에서\n 僕らは超えてゆく\n 우리들은 뛰어넘어 갈거야\n すべての憎しみを\n 모든 미움을\n ニセモノの正義など\n 가짜 정의 따위\n 棄ててしまえ\n 버려 버리라고\n So 愛のために泣けるのは\n 그래서 사랑을 위해 우는 것은\n 君がそこにいるから\n 너가 거기에 있으니까\n We will always be together\n 우린 언제나 함께할 거야\n 愛の\n 사랑의\n 愛のために進むのは\n 사랑을 위해 나아가는 것은\n 君とここにいるから\n 너와 여기에 있으니까\n 僕だけが君を守るから\n 나 하나가 너를 지키니까\n 愛のために願うのは\n 사랑을 위해 비는것은\n そして共に生き抜くこと\n 그리고 같이 살아가기 위해\n ずっと\n 계속\n We all always be together\n 우린 항상 함께할거야  ')
  }
    if(cmd === `${prefix}다음`) {
    const m = await message.channel.send("다음 접속 중 ..");
    m.edit('http://daum.net');
  }
  if(cmd === `${prefix}구글`) {
    const m = await message.channel.send("구글 접속 중 ..");
    m.edit('https://google.com');
  }
  if(cmd === `${prefix}페이스북`) {
    const m = await message.channel.send("페이스북 접속 중 ..");
    m.edit('https://facebook.com');
  }
  if(cmd === `${prefix}페북`) {
    const m = await message.channel.send("페이스북 접속 중 ..");
    m.edit('https://facebook.com');
  }
  if(cmd === `${prefix}힌트`) { //이스터에그 시작
    const m = await message.channel.send("**힌트**");
    m.edit('DJ 컨셉으로 누구나 할 수 있으며 , 실존하는 인물이 아닙니다. \n\n ** - 해당 이벤트에 유난[필요없는 개발자겸 도우미]은 참여를 못합니다 -**');
  }
  
  if(cmd === `${prefix}루시우`) {
    const m = await message.channel.send("**이스터에그**");
    m.edit('이스터에그를 발견하셨군요 ! \n 축하드립니다 :) \n 발견을 하신 분께는 소정의 상품을 보내드립니다. **[010-4415-2391]**로 문자를 남겨주시면 소정의 상품을 구매한 후에 보내드리도록 하겠습니다! \n\n  ** - 해당 이벤트에 유난[필요없는 개발자겸 도우미]은 참여를 못합니다 -**');
  } //이스터에그 끝
  if(cmd === `${prefix}아이디`) {
    const m = await message.channel.send("**Face_Book_Bot**의 ID를 불러오는 중 ..");
    m.edit('제 ID는 : **417379559005093888** 이에요 !');
  }

  //여기부터 Music_Bot 소스

    // 호랑풍류가
if(!message.guild) return;
if (message.content === '!호랑풍류가') {
  if (message.member.voiceChannel) {  //보이스 채널에 들어왔는지 확인
    message.member.voiceChannel.join().then(connection => {
        message.reply('현재 재생 중 > **호랑풍류가**');
        const dispatcher = connection.playFile('music/02.mp3'); //보이스 채널에서 재생하실 소리 위치를 입력
      })
      .catch(console.log);
  } else {
    message.reply('**[오류]** 먼저 음성 채널에 입장해야 합니다.'); 
  }
}
 // 호랑수월가
if(!message.guild) return;
if (message.content === '!호랑수월가') {
  if (message.member.voiceChannel) {  //보이스 채널에 들어왔는지 확인
    message.member.voiceChannel.join().then(connection => {
        message.reply('현재 재생 중 > **호랑수월가**');
        const dispatcher = connection.playFile('music/01.mp3'); //보이스 채널에서 재생하실 소리 위치를 입력
      })
      .catch(console.log);
  } else {
    message.reply('**[오류]** 먼저 음성 채널에 입장해야 합니다.'); 
  }
}

// 바람이 되고 싶었던 아이
if(!message.guild) return;
if (message.content === '!바람이 되고 싶었던 아이') {
  if (message.member.voiceChannel) {  //보이스 채널에 들어왔는지 확인
    message.member.voiceChannel.join().then(connection => {
        message.reply('현재 재생 중 > **바람이 되고 싶었던 아이**');
        const dispatcher = connection.playFile('music/03.mp3'); //보이스 채널에서 재생하실 소리 위치를 입력
      })
      .catch(console.log);
  } else {
    message.reply('**[오류]** 먼저 음성 채널에 입장해야 합니다.'); 
  }
}
// 정지
if(!message.guild) return;
if (message.content === '!정지') {
if (message.member.voiceChannel) {  //보이스 채널에 들어왔는지 확인
  message.member.voiceChannel.join().then(connection => {
      message.reply('노래를 정지하였습니다.');
      const dispatcher = connection.playFile('music/04.mp3'); //보이스 채널에서 재생하실 소리 위치를 입력
    })
    .catch(console.log);
} else {
  message.reply('**[오류]** 먼저 음성 채널에 입장해야 합니다.'); 
}
}

// 멜론
if(!message.guild) return;
if (message.content === '!멜론') {
  if (message.member.voiceChannel) {  //보이스 채널에 들어왔는지 확인
    message.member.voiceChannel.join().then(connection => {
        message.reply('현재 재생 중 > **멜론 Top 10**');
        const dispatcher = connection.playFile('music/05.mp3'); //보이스 채널에서 재생하실 소리 위치를 입력
      })
      .catch(console.log);
  } else {
    message.reply('**[오류]** 먼저 음성 채널에 입장해야 합니다.'); 
  }
}

 // 노게임 노라이프 제로 OST
if(!message.guild) return;
if (message.content === '!Game') {
if (message.member.voiceChannel) {  //보이스 채널에 들어왔는지 확인
  message.member.voiceChannel.join().then(connection => {
      message.reply('현재 재생 중 > **No Game No Life Zero OST - There is a reason**');
      const dispatcher = connection.playFile('music/06.mp3'); //보이스 채널에서 재생하실 소리 위치를 입력
    })
    .catch(console.log);
} else {
  message.reply('**[오류]** 먼저 음성 채널에 입장해야 합니다.'); 
  }
}
// 이스터에그 - 8bit 호랑풍류가
if(!message.guild) return;
if (message.content === '!루시우') {
  if (message.member.voiceChannel) {  //보이스 채널에 들어왔는지 확인
    message.member.voiceChannel.join().then(connection => {
        message.reply('현재 재생 중 > **이스터에그** \n\n  이스터에그에 음원 이용을 허락해주신 **Hanul**님에게 감사드립니다 ! \n\n 해당 음원의 링크[유튜브] : https://abh.kr/3c ');
        const dispatcher = connection.playFile('music/07.mp3'); //보이스 채널에서 재생하실 소리 위치를 입력
      })
      .catch(console.log);
  } else {
    message.reply('**[오류]** 먼저 음성 채널에 입장해야 합니다.'); 
  }
}

// 브금 - 테스트
if(!message.guild) return;
if (message.content === '!브금') {
  if (message.member.voiceChannel) {  //보이스 채널에 들어왔는지 확인
    message.member.voiceChannel.join().then(connection => {
        message.reply('현재 재생 중 > **브금**');
        const dispatcher = connection.playFile('music/08.mp3'); //보이스 채널에서 재생하실 소리 위치를 입력
      })
      .catch(console.log);
  } else {
    message.reply('**[오류]** 먼저 음성 채널에 입장해야 합니다.'); 
  }
}

});

// botconfig.json 에서 봇의 token 을 불러옴
bot.login(process.env.BOT_TOKEN);
