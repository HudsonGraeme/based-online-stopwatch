import i18n from "i18next";
import localforage from "localforage";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Navigation
      Stopwatch: "Stopwatch",
      Countdown: "Countdown",
      Pomodoro: "Pomodoro",
      "Race Timers": "Race Timers",
      "Classroom Timers": "Classroom Timers",
      "Holiday Timers": "Holiday Timers",
      "Random Name Pickers": "Random Name Pickers",
      "Random Number Generators": "Random Number Generators",
      "Sensory Timers": "Sensory Timers",
      Clocks: "Clocks",
      "Exam Timers": "Exam Timers",
      "Chance Games": "Chance Games",
      "Group Generators": "Group Generators",
      "Presentation Timers": "Presentation Timers",
      "Tally Counters": "Tally Counters",

      // Common
      Start: "Start",
      Stop: "Stop",
      Reset: "Reset",
      Lap: "Lap",
      "Go Home": "Go Home",
      Reload: "Reload",
      "Go Fullscreen": "Go Fullscreen",
      "Exit Fullscreen": "Exit Fullscreen",
      Language: "Language",
      "Coming soon...": "Coming soon...",
      FAQ: "FAQ",
      "Open Source": "Open Source",

      // Settings
      Settings: "Settings",
      "Background Image": "Background Image",
      "Upload Image": "Upload Image",
      None: "None",
      "No images uploaded yet": "No images uploaded yet",
      "Invalid file type": "Invalid file type",
      "Please upload image files only": "Please upload image files only",
      "File too large": "File too large",
      "Please upload images smaller than 5MB":
        "Please upload images smaller than 5MB",
      "Upload failed": "Upload failed",
      "Failed to upload": "Failed to upload",
      "Images uploaded": "Images uploaded",
      "Successfully uploaded": "Successfully uploaded",
      "image(s)": "image(s)",
      "Background updated": "Background updated",
      "Failed to update background": "Failed to update background",
      "Background deleted": "Background deleted",
      "Failed to delete background": "Failed to delete background",

      // Keyboard shortcuts
      "Space: Start/Stop": "Space: Start/Stop",
      "R: Reset": "R: Reset",
      "L: Lap": "L: Lap",
      "Esc: Deselect": "Esc: Deselect",
      "Click digits to edit": "Click digits to edit",

      // Timer specific
      "Based Online Stopwatch": "Based Online Stopwatch",
      "Based Online Stopwatch - Free Online Timer & Stopwatch Tools":
        "Based Online Stopwatch - Free Online Timer & Stopwatch Tools",
      "Free online stopwatch, countdown timer, and time tracking tools. Perfect for classrooms, presentations, races, and productivity. No ads, no downloads required.":
        "Free online stopwatch, countdown timer, and time tracking tools. Perfect for classrooms, presentations, races, and productivity. No ads, no downloads required.",

      // Pomodoro specific
      "Pomodoro Timer": "Pomodoro Timer",
      "Focus Time": "Focus Time",
      "Short Break": "Short Break",
      "Long Break": "Long Break",
      Pause: "Pause",
      Continue: "Continue",
      Skip: "Skip",
      "Completed Sessions": "Completed Sessions",
      "Until Long Break": "Until Long Break",
      "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!":
        "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!",
      "Space: Start/Pause": "Space: Start/Pause",
      "S: Skip Phase": "S: Skip Phase",
      "Great job! Time for a long break!": "Great job! Time for a long break!",
      "Work session complete! Time for a short break!":
        "Work session complete! Time for a short break!",
      "Break over! Ready for another work session?":
        "Break over! Ready for another work session?",
      "Long break over! Ready to start fresh?":
        "Long break over! Ready to start fresh?",
      "Pomodoro Phase Complete!": "Pomodoro Phase Complete!",
    },
  },
  es: {
    translation: {
      // Navigation
      Stopwatch: "Cronómetro",
      Countdown: "Cuenta Regresiva",
      Pomodoro: "Pomodoro",
      "Race Timers": "Cronómetros de Carrera",
      "Classroom Timers": "Cronómetros de Aula",
      "Holiday Timers": "Cronómetros de Vacaciones",
      "Random Name Pickers": "Seleccionador de Nombres",
      "Random Number Generators": "Generador de Números",
      "Sensory Timers": "Cronómetros Sensoriales",
      Clocks: "Relojes",
      "Exam Timers": "Cronómetros de Examen",
      "Chance Games": "Juegos de Azar",
      "Group Generators": "Generador de Grupos",
      "Presentation Timers": "Cronómetros de Presentación",
      "Tally Counters": "Contadores",

      // Common
      Start: "Iniciar",
      Stop: "Detener",
      Reset: "Reiniciar",
      Lap: "Vuelta",
      "Go Home": "Ir al Inicio",
      Reload: "Recargar",
      "Go Fullscreen": "Pantalla Completa",
      "Exit Fullscreen": "Salir de Pantalla Completa",
      Language: "Idioma",
      "Coming soon...": "Próximamente...",
      FAQ: "Preguntas Frecuentes",
      "Open Source": "Código Abierto",

      // Settings
      Settings: "Configuración",
      "Background Image": "Imagen de Fondo",
      "Upload Image": "Subir Imagen",
      "Uploading...": "Subiendo...",
      None: "Ninguno",
      "No images uploaded yet": "No se han subido imágenes aún",
      "Invalid file type": "Tipo de archivo inválido",
      "Please upload image files only":
        "Por favor sube solo archivos de imagen",
      "File too large": "Archivo demasiado grande",
      "Please upload images smaller than 5MB":
        "Por favor sube imágenes menores a 5MB",
      "Upload failed": "Subida fallida",
      "Failed to upload": "Falló al subir",
      "Images uploaded": "Imágenes subidas",
      "Successfully uploaded": "Subido exitosamente",
      "image(s)": "imagen(es)",
      "Background updated": "Fondo actualizado",
      "Failed to update background": "Falló al actualizar fondo",
      "Background deleted": "Fondo eliminado",
      "Failed to delete background": "Falló al eliminar fondo",

      // Keyboard shortcuts
      "Space: Start/Stop": "Espacio: Iniciar/Detener",
      "R: Reset": "R: Reiniciar",
      "L: Lap": "L: Vuelta",
      "Esc: Deselect": "Esc: Deseleccionar",
      "Click digits to edit": "Haz clic en los dígitos para editar",

      // Timer specific
      "Based Online Stopwatch": "Cronómetro Online Basado",

      // Pomodoro specific
      "Pomodoro Timer": "Temporizador Pomodoro",
      "Focus Time": "Tiempo de Enfoque",
      "Short Break": "Descanso Corto",
      "Long Break": "Descanso Largo",
      Pause: "Pausar",
      Continue: "Continuar",
      Skip: "Saltar",
      "Completed Sessions": "Sesiones Completadas",
      "Until Long Break": "Hasta Descanso Largo",
      "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!":
        "Trabaja por 25 minutos, luego toma un descanso de 5 minutos. ¡Después de 4 sesiones de trabajo, disfruta de un descanso largo de 15 minutos!",
      "Space: Start/Pause": "Espacio: Iniciar/Pausar",
      "S: Skip Phase": "S: Saltar Fase",
      "Great job! Time for a long break!":
        "¡Buen trabajo! ¡Hora de un descanso largo!",
      "Work session complete! Time for a short break!":
        "¡Sesión de trabajo completa! ¡Hora de un descanso corto!",
      "Break over! Ready for another work session?":
        "¡Descanso terminado! ¿Listo para otra sesión de trabajo?",
      "Long break over! Ready to start fresh?":
        "¡Descanso largo terminado! ¿Listo para empezar de nuevo?",
      "Pomodoro Phase Complete!": "¡Fase Pomodoro Completa!",
    },
  },
  fr: {
    translation: {
      // Navigation
      Stopwatch: "Chronomètre",
      Countdown: "Compte à Rebours",
      Pomodoro: "Pomodoro",
      "Race Timers": "Chronos de Course",
      "Classroom Timers": "Chronos de Classe",
      "Holiday Timers": "Chronos de Vacances",
      "Random Name Pickers": "Sélecteur de Noms",
      "Random Number Generators": "Générateur de Nombres",
      "Sensory Timers": "Chronos Sensoriels",
      Clocks: "Horloges",
      "Exam Timers": "Chronos d'Examen",
      "Chance Games": "Jeux de Hasard",
      "Group Generators": "Générateur de Groupes",
      "Presentation Timers": "Chronos de Présentation",
      "Tally Counters": "Compteurs",

      // Common
      Start: "Commencer",
      Stop: "Arrêter",
      Reset: "Réinitialiser",
      Lap: "Tour",
      "Go Home": "Accueil",
      Reload: "Recharger",
      "Go Fullscreen": "Plein Écran",
      "Exit Fullscreen": "Quitter Plein Écran",
      Language: "Langue",
      "Coming soon...": "Bientôt disponible...",
      FAQ: "FAQ",
      "Open Source": "Open Source",

      // Settings
      Settings: "Paramètres",
      "Background Image": "Image de Fond",
      "Upload Image": "Télécharger Image",
      "Uploading...": "Téléchargement...",
      None: "Aucun",
      "No images uploaded yet": "Aucune image téléchargée",
      "Invalid file type": "Type de fichier invalide",
      "Please upload image files only":
        "Veuillez télécharger uniquement des images",
      "File too large": "Fichier trop volumineux",
      "Please upload images smaller than 5MB":
        "Veuillez télécharger des images inférieures à 5MB",
      "Upload failed": "Échec du téléchargement",
      "Failed to upload": "Échec du téléchargement",
      "Images uploaded": "Images téléchargées",
      "Successfully uploaded": "Téléchargé avec succès",
      "image(s)": "image(s)",
      "Background updated": "Fond mis à jour",
      "Failed to update background": "Échec de mise à jour du fond",
      "Background deleted": "Fond supprimé",
      "Failed to delete background": "Échec de suppression du fond",

      // Keyboard shortcuts
      "Space: Start/Stop": "Espace: Démarrer/Arrêter",
      "R: Reset": "R: Réinitialiser",
      "L: Lap": "L: Tour",
      "Esc: Deselect": "Esc: Désélectionner",
      "Click digits to edit": "Cliquez sur les chiffres pour modifier",

      // Timer specific
      "Based Online Stopwatch": "Chronomètre Online Basé",

      // Pomodoro specific
      "Pomodoro Timer": "Minuteur Pomodoro",
      "Focus Time": "Temps de Concentration",
      "Short Break": "Pause Courte",
      "Long Break": "Pause Longue",
      Pause: "Pause",
      Continue: "Continuer",
      Skip: "Passer",
      "Completed Sessions": "Sessions Complétées",
      "Until Long Break": "Jusqu'à la Pause Longue",
      "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!":
        "Travaillez pendant 25 minutes, puis prenez une pause de 5 minutes. Après 4 sessions de travail, profitez d'une pause longue de 15 minutes!",
      "Space: Start/Pause": "Espace: Démarrer/Pause",
      "S: Skip Phase": "S: Passer la Phase",
      "Great job! Time for a long break!":
        "Bon travail! C'est l'heure de la pause longue!",
      "Work session complete! Time for a short break!":
        "Session de travail terminée! C'est l'heure de la pause courte!",
      "Break over! Ready for another work session?":
        "Pause terminée! Prêt pour une autre session de travail?",
      "Long break over! Ready to start fresh?":
        "Pause longue terminée! Prêt à recommencer?",
      "Pomodoro Phase Complete!": "Phase Pomodoro Complète!",
    },
  },
  de: {
    translation: {
      // Navigation
      Stopwatch: "Stoppuhr",
      Countdown: "Countdown",
      Pomodoro: "Pomodoro",
      "Race Timers": "Rennzeiten",
      "Classroom Timers": "Klassenzeiten",
      "Holiday Timers": "Feiertagszeiten",
      "Random Name Pickers": "Zufallsnamenwähler",
      "Random Number Generators": "Zufallszahlengenerator",
      "Sensory Timers": "Sensorische Zeiten",
      Clocks: "Uhren",
      "Exam Timers": "Prüfungszeiten",
      "Chance Games": "Glücksspiele",
      "Group Generators": "Gruppengenerator",
      "Presentation Timers": "Präsentationszeiten",
      "Tally Counters": "Zähler",

      // Common
      Start: "Start",
      Stop: "Stop",
      Reset: "Zurücksetzen",
      Lap: "Runde",
      "Go Home": "Startseite",
      Reload: "Neu laden",
      "Go Fullscreen": "Vollbild",
      "Exit Fullscreen": "Vollbild beenden",
      Language: "Sprache",
      "Coming soon...": "Demnächst...",
      FAQ: "FAQ",
      "Open Source": "Open Source",

      // Settings
      Settings: "Einstellungen",
      "Background Image": "Hintergrundbild",
      "Upload Image": "Bild hochladen",
      "Uploading...": "Wird hochgeladen...",
      None: "Keine",
      "No images uploaded yet": "Noch keine Bilder hochgeladen",
      "Invalid file type": "Ungültiger Dateityp",
      "Please upload image files only": "Bitte nur Bilddateien hochladen",
      "File too large": "Datei zu groß",
      "Please upload images smaller than 5MB":
        "Bitte Bilder unter 5MB hochladen",
      "Upload failed": "Upload fehlgeschlagen",
      "Failed to upload": "Upload fehlgeschlagen",
      "Images uploaded": "Bilder hochgeladen",
      "Successfully uploaded": "Erfolgreich hochgeladen",
      "image(s)": "Bild(er)",
      "Background updated": "Hintergrund aktualisiert",
      "Failed to update background":
        "Hintergrund konnte nicht aktualisiert werden",
      "Background deleted": "Hintergrund gelöscht",
      "Failed to delete background": "Hintergrund konnte nicht gelöscht werden",

      // Keyboard shortcuts
      "Space: Start/Stop": "Leertaste: Start/Stop",
      "R: Reset": "R: Zurücksetzen",
      "L: Lap": "L: Runde",
      "Esc: Deselect": "Esc: Abwählen",
      "Click digits to edit": "Klicken Sie auf Ziffern zum Bearbeiten",

      // Timer specific
      "Based Online Stopwatch": "Based Online Stoppuhr",

      // Pomodoro specific
      "Pomodoro Timer": "Pomodoro-Timer",
      "Focus Time": "Fokuszeit",
      "Short Break": "Kurze Pause",
      "Long Break": "Lange Pause",
      Pause: "Pause",
      Continue: "Fortsetzen",
      Skip: "Überspringen",
      "Completed Sessions": "Abgeschlossene Sitzungen",
      "Until Long Break": "Bis zur Langen Pause",
      "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!":
        "Arbeite 25 Minuten, dann mache 5 Minuten Pause. Nach 4 Arbeitssitzungen genieße eine 15-minütige lange Pause!",
      "Space: Start/Pause": "Leertaste: Start/Pause",
      "S: Skip Phase": "S: Phase Überspringen",
      "Great job! Time for a long break!":
        "Großartig! Zeit für eine lange Pause!",
      "Work session complete! Time for a short break!":
        "Arbeitssitzung abgeschlossen! Zeit für eine kurze Pause!",
      "Break over! Ready for another work session?":
        "Pause vorbei! Bereit für eine weitere Arbeitssitzung?",
      "Long break over! Ready to start fresh?":
        "Lange Pause vorbei! Bereit für einen Neustart?",
      "Pomodoro Phase Complete!": "Pomodoro-Phase Abgeschlossen!",
    },
  },
  it: {
    translation: {
      // Navigation
      Stopwatch: "Cronometro",
      Countdown: "Conto alla Rovescia",
      Pomodoro: "Pomodoro",
      "Race Timers": "Timer di Gara",
      "Classroom Timers": "Timer per Aula",
      "Holiday Timers": "Timer per Vacanze",
      "Random Name Pickers": "Selettore di Nomi",
      "Random Number Generators": "Generatore di Numeri",
      "Sensory Timers": "Timer Sensoriali",
      Clocks: "Orologi",
      "Exam Timers": "Timer per Esami",
      "Chance Games": "Giochi d'Azzardo",
      "Group Generators": "Generatore di Gruppi",
      "Presentation Timers": "Timer per Presentazioni",
      "Tally Counters": "Contatori",

      // Common
      Start: "Avvia",
      Stop: "Stop",
      Reset: "Reimposta",
      Lap: "Giro",
      "Go Home": "Vai alla Home",
      Reload: "Ricarica",
      "Go Fullscreen": "Schermo Intero",
      "Exit Fullscreen": "Esci da Schermo Intero",
      Language: "Lingua",
      "Coming soon...": "Prossimamente...",
      FAQ: "FAQ",
      "Open Source": "Open Source",

      // Settings
      Settings: "Impostazioni",
      "Background Image": "Immagine di Sfondo",
      "Upload Image": "Carica Immagine",
      "Uploading...": "Caricamento...",
      None: "Nessuno",
      "No images uploaded yet": "Nessuna immagine caricata ancora",
      "Invalid file type": "Tipo di file non valido",
      "Please upload image files only":
        "Si prega di caricare solo file immagine",
      "File too large": "File troppo grande",
      "Please upload images smaller than 5MB":
        "Si prega di caricare immagini inferiori a 5MB",
      "Upload failed": "Caricamento fallito",
      "Failed to upload": "Caricamento fallito",
      "Images uploaded": "Immagini caricate",
      "Successfully uploaded": "Caricato con successo",
      "image(s)": "immagine/i",
      "Background updated": "Sfondo aggiornato",
      "Failed to update background": "Impossibile aggiornare lo sfondo",
      "Background deleted": "Sfondo eliminato",
      "Failed to delete background": "Impossibile eliminare lo sfondo",

      // Keyboard shortcuts
      "Space: Start/Stop": "Spazio: Avvia/Stop",
      "R: Reset": "R: Reimposta",
      "L: Lap": "L: Giro",
      "Esc: Deselect": "Esc: Deseleziona",
      "Click digits to edit": "Clicca sui numeri per modificare",

      // Timer specific
      "Based Online Stopwatch": "Cronometro Online Basato",

      // Pomodoro specific
      "Pomodoro Timer": "Timer Pomodoro",
      "Focus Time": "Tempo di Focus",
      "Short Break": "Pausa Breve",
      "Long Break": "Pausa Lunga",
      Pause: "Pausa",
      Continue: "Continua",
      Skip: "Salta",
      "Completed Sessions": "Sessioni Completate",
      "Until Long Break": "Fino alla Pausa Lunga",
      "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!":
        "Lavora per 25 minuti, poi fai una pausa di 5 minuti. Dopo 4 sessioni di lavoro, goditi una pausa lunga di 15 minuti!",
      "Space: Start/Pause": "Spazio: Avvia/Pausa",
      "S: Skip Phase": "S: Salta Fase",
      "Great job! Time for a long break!":
        "Ottimo lavoro! È ora di una pausa lunga!",
      "Work session complete! Time for a short break!":
        "Sessione di lavoro completata! È ora di una pausa breve!",
      "Break over! Ready for another work session?":
        "Pausa finita! Pronto per un'altra sessione di lavoro?",
      "Long break over! Ready to start fresh?":
        "Pausa lunga finita! Pronto per ricominciare?",
      "Pomodoro Phase Complete!": "Fase Pomodoro Completata!",
    },
  },
  pt: {
    translation: {
      // Navigation
      Stopwatch: "Cronômetro",
      Countdown: "Contagem Regressiva",
      Pomodoro: "Pomodoro",
      "Race Timers": "Cronômetros de Corrida",
      "Classroom Timers": "Cronômetros de Aula",
      "Holiday Timers": "Cronômetros de Feriado",
      "Random Name Pickers": "Seletor de Nomes",
      "Random Number Generators": "Gerador de Números",
      "Sensory Timers": "Cronômetros Sensoriais",
      Clocks: "Relógios",
      "Exam Timers": "Cronômetros de Exame",
      "Chance Games": "Jogos de Azar",
      "Group Generators": "Gerador de Grupos",
      "Presentation Timers": "Cronômetros de Apresentação",
      "Tally Counters": "Contadores",

      // Common
      Start: "Iniciar",
      Stop: "Parar",
      Reset: "Resetar",
      Lap: "Volta",
      "Go Home": "Ir para Início",
      Reload: "Recarregar",
      "Go Fullscreen": "Tela Cheia",
      "Exit Fullscreen": "Sair da Tela Cheia",
      Language: "Idioma",
      "Coming soon...": "Em breve...",
      FAQ: "Perguntas Frequentes",
      "Open Source": "Código Aberto",

      // Settings
      Settings: "Configurações",
      "Background Image": "Imagem de Fundo",
      "Upload Image": "Enviar Imagem",
      "Uploading...": "Enviando...",
      None: "Nenhum",
      "No images uploaded yet": "Nenhuma imagem enviada ainda",
      "Invalid file type": "Tipo de arquivo inválido",
      "Please upload image files only":
        "Por favor envie apenas arquivos de imagem",
      "File too large": "Arquivo muito grande",
      "Please upload images smaller than 5MB":
        "Por favor envie imagens menores que 5MB",
      "Upload failed": "Falha no envio",
      "Failed to upload": "Falha ao enviar",
      "Images uploaded": "Imagens enviadas",
      "Successfully uploaded": "Enviado com sucesso",
      "image(s)": "imagem(ns)",
      "Background updated": "Fundo atualizado",
      "Failed to update background": "Falha ao atualizar fundo",
      "Background deleted": "Fundo excluído",
      "Failed to delete background": "Falha ao excluir fundo",

      // Keyboard shortcuts
      "Space: Start/Stop": "Espaço: Iniciar/Parar",
      "R: Reset": "R: Resetar",
      "L: Lap": "L: Volta",
      "Esc: Deselect": "Esc: Desselecionar",
      "Click digits to edit": "Clique nos dígitos para editar",

      // Timer specific
      "Based Online Stopwatch": "Cronômetro Online Baseado",

      // Pomodoro specific
      "Pomodoro Timer": "Temporizador Pomodoro",
      "Focus Time": "Tempo de Foco",
      "Short Break": "Pausa Curta",
      "Long Break": "Pausa Longa",
      Pause: "Pausar",
      Continue: "Continuar",
      Skip: "Pular",
      "Completed Sessions": "Sessões Concluídas",
      "Until Long Break": "Até a Pausa Longa",
      "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!":
        "Trabalhe por 25 minutos, depois faça uma pausa de 5 minutos. Após 4 sessões de trabalho, aproveite uma pausa longa de 15 minutos!",
      "Space: Start/Pause": "Espaço: Iniciar/Pausar",
      "S: Skip Phase": "S: Pular Fase",
      "Great job! Time for a long break!":
        "Ótimo trabalho! Hora de uma pausa longa!",
      "Work session complete! Time for a short break!":
        "Sessão de trabalho concluída! Hora de uma pausa curta!",
      "Break over! Ready for another work session?":
        "Pausa terminada! Pronto para outra sessão de trabalho?",
      "Long break over! Ready to start fresh?":
        "Pausa longa terminada! Pronto para recomeçar?",
      "Pomodoro Phase Complete!": "Fase Pomodoro Concluída!",
    },
  },
  zh: {
    translation: {
      // Navigation
      Stopwatch: "秒表",
      Countdown: "倒计时",
      Pomodoro: "番茄钟",
      "Race Timers": "比赛计时器",
      "Classroom Timers": "课堂计时器",
      "Holiday Timers": "节日计时器",
      "Random Name Pickers": "随机姓名选择器",
      "Random Number Generators": "随机数生成器",
      "Sensory Timers": "感官计时器",
      Clocks: "时钟",
      "Exam Timers": "考试计时器",
      "Chance Games": "机会游戏",
      "Group Generators": "组生成器",
      "Presentation Timers": "演示计时器",
      "Tally Counters": "计数器",

      // Common
      Start: "开始",
      Stop: "停止",
      Reset: "重置",
      Lap: "圈",
      "Go Home": "回到首页",
      Reload: "重新加载",
      "Go Fullscreen": "全屏",
      "Exit Fullscreen": "退出全屏",
      Language: "语言",
      "Coming soon...": "即将推出...",
      FAQ: "常见问题",
      "Open Source": "开源",

      // Settings
      Settings: "设置",
      "Background Image": "背景图片",
      "Upload Image": "上传图片",
      "Uploading...": "上传中...",
      None: "无",
      "No images uploaded yet": "尚未上传图片",
      "Invalid file type": "文件类型无效",
      "Please upload image files only": "请只上传图片文件",
      "File too large": "文件过大",
      "Please upload images smaller than 5MB": "请上传小于5MB的图片",
      "Upload failed": "上传失败",
      "Failed to upload": "上传失败",
      "Images uploaded": "图片已上传",
      "Successfully uploaded": "上传成功",
      "image(s)": "张图片",
      "Background updated": "背景已更新",
      "Failed to update background": "背景更新失败",
      "Background deleted": "背景已删除",
      "Failed to delete background": "背景删除失败",

      // Keyboard shortcuts
      "Space: Start/Stop": "空格键: 开始/停止",
      "R: Reset": "R: 重置",
      "L: Lap": "L: 计圈",
      "Esc: Deselect": "Esc: 取消选择",
      "Click digits to edit": "点击数字进行编辑",

      // Timer specific
      "Based Online Stopwatch": "基础在线秒表",

      // Pomodoro specific
      "Pomodoro Timer": "番茄工作法计时器",
      "Focus Time": "专注时间",
      "Short Break": "短休息",
      "Long Break": "长休息",
      Pause: "暂停",
      Continue: "继续",
      Skip: "跳过",
      "Completed Sessions": "已完成会话",
      "Until Long Break": "距离长休息",
      "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!":
        "工作25分钟，然后休息5分钟。4个工作会话后，享受15分钟的长休息！",
      "Space: Start/Pause": "空格键：开始/暂停",
      "S: Skip Phase": "S：跳过阶段",
      "Great job! Time for a long break!": "做得好！该长休息了！",
      "Work session complete! Time for a short break!":
        "工作会话完成！该短休息了！",
      "Break over! Ready for another work session?":
        "休息结束！准备好另一个工作会话了吗？",
      "Long break over! Ready to start fresh?":
        "长休息结束！准备好重新开始了吗？",
      "Pomodoro Phase Complete!": "番茄钟阶段完成！",
    },
  },
  ja: {
    translation: {
      // Navigation
      Stopwatch: "ストップウォッチ",
      Countdown: "カウントダウン",
      Pomodoro: "ポモドーロ",
      "Race Timers": "レースタイマー",
      "Classroom Timers": "教室タイマー",
      "Holiday Timers": "休日タイマー",
      "Random Name Pickers": "ランダム名前選択",
      "Random Number Generators": "乱数生成器",
      "Sensory Timers": "感覚タイマー",
      Clocks: "時計",
      "Exam Timers": "試験タイマー",
      "Chance Games": "チャンスゲーム",
      "Group Generators": "グループ生成器",
      "Presentation Timers": "プレゼンタイマー",
      "Tally Counters": "カウンター",

      // Common
      Start: "開始",
      Stop: "停止",
      Reset: "リセット",
      Lap: "ラップ",
      "Go Home": "ホームに戻る",
      Reload: "再読み込み",
      "Go Fullscreen": "フルスクリーン",
      "Exit Fullscreen": "フルスクリーン終了",
      Language: "言語",
      "Coming soon...": "近日公開...",
      FAQ: "よくある質問",
      "Open Source": "オープンソース",

      // Settings
      Settings: "設定",
      "Background Image": "背景画像",
      "Upload Image": "画像をアップロード",
      "Uploading...": "アップロード中...",
      None: "なし",
      "No images uploaded yet": "まだ画像がアップロードされていません",
      "Invalid file type": "無効なファイルタイプ",
      "Please upload image files only":
        "画像ファイルのみアップロードしてください",
      "File too large": "ファイルが大きすぎます",
      "Please upload images smaller than 5MB":
        "5MB未満の画像をアップロードしてください",
      "Upload failed": "アップロード失敗",
      "Failed to upload": "アップロードに失敗しました",
      "Images uploaded": "画像がアップロードされました",
      "Successfully uploaded": "正常にアップロードされました",
      "image(s)": "枚の画像",
      "Background updated": "背景が更新されました",
      "Failed to update background": "背景の更新に失敗しました",
      "Background deleted": "背景が削除されました",
      "Failed to delete background": "背景の削除に失敗しました",

      // Keyboard shortcuts
      "Space: Start/Stop": "スペース: 開始/停止",
      "R: Reset": "R: リセット",
      "L: Lap": "L: ラップ",
      "Esc: Deselect": "Esc: 選択解除",
      "Click digits to edit": "数字をクリックして編集",

      // Timer specific
      "Based Online Stopwatch": "ベースオンラインストップウォッチ",

      // Pomodoro specific
      "Pomodoro Timer": "ポモドーロタイマー",
      "Focus Time": "集中タイム",
      "Short Break": "小休憩",
      "Long Break": "長休憩",
      Pause: "一時停止",
      Continue: "続ける",
      Skip: "スキップ",
      "Completed Sessions": "完了セッション",
      "Until Long Break": "長休憩まで",
      "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!":
        "25分間作業して、5分間休憩します。4回の作業セッションの後は、15分間の長休憩をお楽しみください！",
      "Space: Start/Pause": "スペース：開始/一時停止",
      "S: Skip Phase": "S：フェーズをスキップ",
      "Great job! Time for a long break!": "素晴らしい！長休憩の時間です！",
      "Work session complete! Time for a short break!":
        "作業セッション完了！小休憩の時間です！",
      "Break over! Ready for another work session?":
        "休憩終了！次の作業セッションの準備はできましたか？",
      "Long break over! Ready to start fresh?":
        "長休憩終了！新たに始める準備はできましたか？",
      "Pomodoro Phase Complete!": "ポモドーロフェーズ完了！",
    },
  },
  ko: {
    translation: {
      // Navigation
      Stopwatch: "스톱워치",
      Countdown: "카운트다운",
      Pomodoro: "포모도로",
      "Race Timers": "경주 타이머",
      "Classroom Timers": "교실 타이머",
      "Holiday Timers": "휴일 타이머",
      "Random Name Pickers": "무작위 이름 선택",
      "Random Number Generators": "난수 생성기",
      "Sensory Timers": "감각 타이머",
      Clocks: "시계",
      "Exam Timers": "시험 타이머",
      "Chance Games": "기회 게임",
      "Group Generators": "그룹 생성기",
      "Presentation Timers": "프레젠테이션 타이머",
      "Tally Counters": "카운터",

      // Common
      Start: "시작",
      Stop: "정지",
      Reset: "재설정",
      Lap: "랩",
      "Go Home": "홈으로",
      Reload: "새로고침",
      "Go Fullscreen": "전체화면",
      "Exit Fullscreen": "전체화면 종료",
      Language: "언어",
      "Coming soon...": "곧 출시...",
      FAQ: "자주 묻는 질문",
      "Open Source": "오픈소스",

      // Settings
      Settings: "설정",
      "Background Image": "배경 이미지",
      "Upload Image": "이미지 업로드",
      "Uploading...": "업로드 중...",
      None: "없음",
      "No images uploaded yet": "아직 업로드된 이미지가 없습니다",
      "Invalid file type": "잘못된 파일 형식",
      "Please upload image files only": "이미지 파일만 업로드해주세요",
      "File too large": "파일이 너무 큽니다",
      "Please upload images smaller than 5MB":
        "5MB보다 작은 이미지를 업로드해주세요",
      "Upload failed": "업로드 실패",
      "Failed to upload": "업로드에 실패했습니다",
      "Images uploaded": "이미지가 업로드되었습니다",
      "Successfully uploaded": "성공적으로 업로드되었습니다",
      "image(s)": "개 이미지",
      "Background updated": "배경이 업데이트되었습니다",
      "Failed to update background": "배경 업데이트에 실패했습니다",
      "Background deleted": "배경이 삭제되었습니다",
      "Failed to delete background": "배경 삭제에 실패했습니다",

      // Keyboard shortcuts
      "Space: Start/Stop": "스페이스: 시작/정지",
      "R: Reset": "R: 리셋",
      "L: Lap": "L: 랩",
      "Esc: Deselect": "Esc: 선택 해제",
      "Click digits to edit": "숫자를 클릭하여 편집",

      // Timer specific
      "Based Online Stopwatch": "베이스 온라인 스톱워치",

      // Pomodoro specific
      "Pomodoro Timer": "포모도로 타이머",
      "Focus Time": "집중 시간",
      "Short Break": "짧은 휴식",
      "Long Break": "긴 휴식",
      Pause: "일시정지",
      Continue: "계속",
      Skip: "건너뛰기",
      "Completed Sessions": "완료된 세션",
      "Until Long Break": "긴 휴식까지",
      "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!":
        "25분 동안 일하고 5분 동안 휴식하세요. 4번의 작업 세션 후에는 15분의 긴 휴식을 즐겨보세요!",
      "Space: Start/Pause": "스페이스: 시작/일시정지",
      "S: Skip Phase": "S: 단계 건너뛰기",
      "Great job! Time for a long break!": "훌륭해요! 긴 휴식 시간입니다!",
      "Work session complete! Time for a short break!":
        "작업 세션 완료! 짧은 휴식 시간입니다!",
      "Break over! Ready for another work session?":
        "휴식 끝! 다른 작업 세션을 준비하셨나요?",
      "Long break over! Ready to start fresh?":
        "긴 휴식 끝! 새롭게 시작할 준비가 되셨나요?",
      "Pomodoro Phase Complete!": "포모도로 단계 완료!",
    },
  },
  ru: {
    translation: {
      // Navigation
      Stopwatch: "Секундомер",
      Countdown: "Обратный отсчет",
      Pomodoro: "Помодоро",
      "Race Timers": "Гоночные таймеры",
      "Classroom Timers": "Классные таймеры",
      "Holiday Timers": "Праздничные таймеры",
      "Random Name Pickers": "Выбор имён",
      "Random Number Generators": "Генератор чисел",
      "Sensory Timers": "Сенсорные таймеры",
      Clocks: "Часы",
      "Exam Timers": "Экзаменационные таймеры",
      "Chance Games": "Игры удачи",
      "Group Generators": "Генератор групп",
      "Presentation Timers": "Презентационные таймеры",
      "Tally Counters": "Счетчики",

      // Common
      Start: "Старт",
      Stop: "Стоп",
      Reset: "Сброс",
      Lap: "Круг",
      "Go Home": "На главную",
      Reload: "Перезагрузить",
      "Go Fullscreen": "Во весь экран",
      "Exit Fullscreen": "Выйти из полноэкранного режима",
      Language: "Язык",
      "Coming soon...": "Скоро...",
      FAQ: "Часто задаваемые вопросы",
      "Open Source": "Открытый исходный код",

      // Settings
      Settings: "Настройки",
      "Background Image": "Фоновое изображение",
      "Upload Image": "Загрузить изображение",
      "Uploading...": "Загрузка...",
      None: "Нет",
      "No images uploaded yet": "Изображения еще не загружены",
      "Invalid file type": "Неверный тип файла",
      "Please upload image files only":
        "Пожалуйста, загружайте только файлы изображений",
      "File too large": "Файл слишком большой",
      "Please upload images smaller than 5MB":
        "Пожалуйста, загружайте изображения меньше 5MB",
      "Upload failed": "Ошибка загрузки",
      "Failed to upload": "Не удалось загрузить",
      "Images uploaded": "Изображения загружены",
      "Successfully uploaded": "Успешно загружено",
      "image(s)": "изображение(-я)",
      "Background updated": "Фон обновлен",
      "Failed to update background": "Не удалось обновить фон",
      "Background deleted": "Фон удален",
      "Failed to delete background": "Не удалось удалить фон",

      // Keyboard shortcuts
      "Space: Start/Stop": "Пробел: Пуск/Остановка",
      "R: Reset": "R: Сброс",
      "L: Lap": "L: Круг",
      "Esc: Deselect": "Esc: Отмена выбора",
      "Click digits to edit": "Нажмите на цифры для редактирования",

      // Timer specific
      "Based Online Stopwatch": "Базовый онлайн секундомер",

      // Pomodoro specific
      "Pomodoro Timer": "Таймер Помодоро",
      "Focus Time": "Время фокуса",
      "Short Break": "Короткий перерыв",
      "Long Break": "Длинный перерыв",
      Pause: "Пауза",
      Continue: "Продолжить",
      Skip: "Пропустить",
      "Completed Sessions": "Завершенные сессии",
      "Until Long Break": "До длинного перерыва",
      "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!":
        "Работайте 25 минут, затем сделайте 5-минутный перерыв. После 4 рабочих сессий насладитесь 15-минутным длинным перерывом!",
      "Space: Start/Pause": "Пробел: Пуск/Пауза",
      "S: Skip Phase": "S: Пропустить фазу",
      "Great job! Time for a long break!": "Отлично! Время длинного перерыва!",
      "Work session complete! Time for a short break!":
        "Рабочая сессия завершена! Время короткого перерыва!",
      "Break over! Ready for another work session?":
        "Перерыв окончен! Готовы к новой рабочей сессии?",
      "Long break over! Ready to start fresh?":
        "Длинный перерыв окончен! Готовы начать заново?",
      "Pomodoro Phase Complete!": "Фаза Помодоро завершена!",
    },
  },
  ar: {
    translation: {
      // Navigation
      Stopwatch: "ساعة إيقاف",
      Countdown: "العد التنازلي",
      Pomodoro: "بومودورو",
      "Race Timers": "مؤقتات السباق",
      "Classroom Timers": "مؤقتات الفصل",
      "Holiday Timers": "مؤقتات العطلة",
      "Random Name Pickers": "منتقي الأسماء",
      "Random Number Generators": "مولد الأرقام",
      "Sensory Timers": "المؤقتات الحسية",
      Clocks: "الساعات",
      "Exam Timers": "مؤقتات الامتحان",
      "Chance Games": "ألعاب الحظ",
      "Group Generators": "مولد المجموعات",
      "Presentation Timers": "مؤقتات العرض",
      "Tally Counters": "العدادات",

      // Common
      Start: "ابدأ",
      Stop: "توقف",
      Reset: "إعادة تعيين",
      Lap: "لفة",
      "Go Home": "الصفحة الرئيسية",
      Reload: "إعادة تحميل",
      "Go Fullscreen": "شاشة كاملة",
      "Exit Fullscreen": "خروج من الشاشة الكاملة",
      Language: "اللغة",
      "Coming soon...": "قريباً...",
      FAQ: "الأسئلة الشائعة",
      "Open Source": "مفتوح المصدر",

      // Settings
      Settings: "الإعدادات",
      "Background Image": "صورة الخلفية",
      "Upload Image": "رفع صورة",
      "Uploading...": "جاري الرفع...",
      None: "لا شيء",
      "No images uploaded yet": "لم يتم رفع صور بعد",
      "Invalid file type": "نوع ملف غير صحيح",
      "Please upload image files only": "يرجى رفع ملفات الصور فقط",
      "File too large": "الملف كبير جداً",
      "Please upload images smaller than 5MB":
        "يرجى رفع صور أصغر من 5 ميجابايت",
      "Upload failed": "فشل الرفع",
      "Failed to upload": "فشل في الرفع",
      "Images uploaded": "تم رفع الصور",
      "Successfully uploaded": "تم الرفع بنجاح",
      "image(s)": "صورة/صور",
      "Background updated": "تم تحديث الخلفية",
      "Failed to update background": "فشل في تحديث الخلفية",
      "Background deleted": "تم حذف الخلفية",
      "Failed to delete background": "فشل في حذف الخلفية",

      // Keyboard shortcuts
      "Space: Start/Stop": "مسافة: بدء/إيقاف",
      "R: Reset": "R: إعادة تعيين",
      "L: Lap": "L: لفة",
      "Esc: Deselect": "Esc: إلغاء التحديد",
      "Click digits to edit": "انقر على الأرقام للتحرير",

      // Timer specific
      "Based Online Stopwatch": "ساعة الإيقاف الأساسية",

      // Pomodoro specific
      "Pomodoro Timer": "مؤقت بومودورو",
      "Focus Time": "وقت التركيز",
      "Short Break": "استراحة قصيرة",
      "Long Break": "استراحة طويلة",
      Pause: "إيقاف مؤقت",
      Continue: "متابعة",
      Skip: "تخطي",
      "Completed Sessions": "الجلسات المنجزة",
      "Until Long Break": "حتى الاستراحة الطويلة",
      "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!":
        "اعمل لمدة 25 دقيقة، ثم خذ استراحة 5 دقائق. بعد 4 جلسات عمل، استمتع باستراحة طويلة لمدة 15 دقيقة!",
      "Space: Start/Pause": "مسافة: بدء/إيقاف مؤقت",
      "S: Skip Phase": "S: تخطي المرحلة",
      "Great job! Time for a long break!":
        "عمل رائع! حان وقت الاستراحة الطويلة!",
      "Work session complete! Time for a short break!":
        "جلسة العمل مكتملة! حان وقت الاستراحة القصيرة!",
      "Break over! Ready for another work session?":
        "انتهت الاستراحة! هل أنت مستعد لجلسة عمل أخرى؟",
      "Long break over! Ready to start fresh?":
        "انتهت الاستراحة الطويلة! هل أنت مستعد للبدء من جديد؟",
      "Pomodoro Phase Complete!": "اكتملت مرحلة بومودورو!",
    },
  },
  hi: {
    translation: {
      // Navigation
      Stopwatch: "स्टॉपवॉच",
      Countdown: "काउंटडाउन",
      Pomodoro: "पोमोडोरो",
      "Race Timers": "रेस टाइमर",
      "Classroom Timers": "कक्षा टाइमर",
      "Holiday Timers": "छुट्टी टाइमर",
      "Random Name Pickers": "नाम चुनने वाला",
      "Random Number Generators": "संख्या जनरेटर",
      "Sensory Timers": "संवेदी टाइमर",
      Clocks: "घड़ियां",
      "Exam Timers": "परीक्षा टाइमर",
      "Chance Games": "मौका खेल",
      "Group Generators": "समूह जनरेटर",
      "Presentation Timers": "प्रस्तुति टाइमर",
      "Tally Counters": "काउंटर",

      // Common
      Start: "शुरू",
      Stop: "रोकें",
      Reset: "रीसेट",
      Lap: "लैप",
      "Go Home": "होम जाएं",
      Reload: "पुनः लोड",
      "Go Fullscreen": "पूर्ण स्क्रीन",
      "Exit Fullscreen": "पूर्ण स्क्रीन से बाहर निकलें",
      Language: "भाषा",
      "Coming soon...": "जल्द आ रहा है...",
      FAQ: "अक्सर पूछे जाने वाले प्रश्न",
      "Open Source": "ओपन सोर्स",

      // Settings
      Settings: "सेटिंग्स",
      "Background Image": "बैकग्राउंड इमेज",
      "Upload Image": "इमेज अपलोड करें",
      "Uploading...": "अपलोड हो रहा है...",
      None: "कोई नहीं",
      "No images uploaded yet": "अभी तक कोई इमेज अपलोड नहीं की गई",
      "Invalid file type": "अमान्य फ़ाइल प्रकार",
      "Please upload image files only": "कृपया केवल इमेज फ़ाइलें अपलोड करें",
      "File too large": "फ़ाइल बहुत बड़ी है",
      "Please upload images smaller than 5MB":
        "कृपया 5MB से छोटी इमेज अपलोड करें",
      "Upload failed": "अपलोड असफल",
      "Failed to upload": "अपलोड करने में असफल",
      "Images uploaded": "इमेज अपलोड हो गईं",
      "Successfully uploaded": "सफलतापूर्वक अपलोड हुआ",
      "image(s)": "इमेज",
      "Background updated": "बैकग्राउंड अपडेट हो गया",
      "Failed to update background": "बैकग्राउंड अपडेट करने में असफल",
      "Background deleted": "बैकग्राउंड डिलीट हो गया",
      "Failed to delete background": "बैकग्राउंड डिलीट करने में असफल",

      // Keyboard shortcuts
      "Space: Start/Stop": "स्पेस: शुरू/बंद",
      "R: Reset": "R: रीसेट",
      "L: Lap": "L: लैप",
      "Esc: Deselect": "Esc: चयन हटाएं",
      "Click digits to edit": "संपादित करने के लिए अंकों पर क्लिक करें",

      // Timer specific
      "Based Online Stopwatch": "आधारित ऑनलाइन स्टॉपवॉच",

      // Pomodoro specific
      "Pomodoro Timer": "पोमोडोरो टाइमर",
      "Focus Time": "फोकस टाइम",
      "Short Break": "छोटा ब्रेक",
      "Long Break": "लंबा ब्रेक",
      Pause: "रोकें",
      Continue: "जारी रखें",
      Skip: "छोडें",
      "Completed Sessions": "पूरे सेशन",
      "Until Long Break": "लंबे ब्रेक तक",
      "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!":
        "25 मिनट काम करें, फिर 5 मिनट का ब्रेक लें। 4 काम के सेशन के बाद 15 मिनट के लंबे ब्रेक का आनंद लें!",
      "Space: Start/Pause": "स्पेस: शुरू/रोकें",
      "S: Skip Phase": "S: चरण छोडें",
      "Great job! Time for a long break!": "बहुत बढ़िया! लंबे ब्रेक का समय!",
      "Work session complete! Time for a short break!":
        "काम का सेशन पूरा! छोटे ब्रेक का समय!",
      "Break over! Ready for another work session?":
        "ब्रेक खत्म! दूसरे काम के सेशन के लिए तैयार?",
      "Long break over! Ready to start fresh?":
        "लंबा ब्रेक खत्म! नई शुरुआत के लिए तैयार?",
      "Pomodoro Phase Complete!": "पोमोडोरो चरण पूरा!",
    },
  },
};

const initI18n = async () => {
  let savedLanguage;
  try {
    savedLanguage = await localforage.getItem<string>("language");
  } catch (error) {
    console.error("Error loading saved language:", error);
  }

  // Enhanced language detection
  const browserLanguages = navigator.languages || [navigator.language];
  const supportedLanguages = Object.keys(resources);

  let detectedLanguage = "en";
  for (const lang of browserLanguages) {
    const baseLanguage = lang.split("-")[0];
    if (supportedLanguages.includes(baseLanguage)) {
      detectedLanguage = baseLanguage;
      break;
    }
  }

  const defaultLanguage = detectedLanguage;

  return i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage || defaultLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

export const changeLanguage = async (language: string) => {
  try {
    await localforage.setItem("language", language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error("Error saving language preference:", error);
  }
};

export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];

export { initI18n };
export default i18n;
