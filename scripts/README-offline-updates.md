# ערוץ העדכונים של "אחותי כלה" (גרסת מחשב / NetFree)

## איך זה עובד
- המשתמשת מורידה **קובץ אחד בלבד**: `achoti-kalah.html` (כ-17KB).
  כתובת קבועה: `https://hagitmualem.com/downloads/achoti-kalah.html`
- בפתיחה הראשונה הוא מוריד את האתר ושומר אותו במחשב (IndexedDB).
- בכל פתיחה נוספת האתר נפתח מהמחשב — גם בלי אינטרנט.
- ברקע נבדק המניפסט `https://hagitmualem.com/updates/manifest.js` (נטען כתג script — הערוץ שעובד ב-NetFree).
  אם יש גרסה חדשה, מורידים **רק קבצים שהשתנו** (זיהוי לפי חתימת תוכן), מאמתים גודל + checksum,
  ורק אחרי שהכול ירד בהצלחה מפעילים את הגרסה החדשה בפתיחה הבאה.
- הגרסה הקודמת נשמרת. אם גרסה חדשה לא נפתחת פעמיים ברצף — חוזרים אליה אוטומטית.
- אין אינטרנט / העדכון נכשל → האתר המקומי ממשיך לעבוד רגיל.

## איך מפרסמים גרסה חדשה
1. לחלץ את תיקיית הגרסה החדשה של האתר (התיקייה שמכילה `index.html`, `app.js`, `assets/`, `media/` וכו').
2. להריץ:

```bash
node scripts/build-offline-update.mjs /path/to/app-folder --version 42
```

(אם לא מציינים `--version`, המספר עולה ב-1 אוטומטית.)

הסקריפט:
- מחשב חתימה לכל קובץ,
- מעלה רק קבצים חדשים/שהשתנו (השאר נשארים כפי שהם — תמונות/אודיו/גופנים לא נשלחים שוב),
- כותב `public/updates/manifest.js` + `manifest.json`.

3. לפרסם את האתר. זהו — כל המשתמשות יקבלו את העדכון אוטומטית בפתיחה הבאה.

רישום הקבצים שכבר הועלו: `scripts/offline-update-registry.json` (לא למחוק — הוא מה שמונע העלאות כפולות).

## שלב א' — ליבה בלבד (גרסה 42)

המניפסט הנוכחי כולל רק את קבצי הליבה: `index.html`, `app.js`, `assets/style.css`,
אייקונים, `favicon.ico`, `manifest.webmanifest`, `placeholder.svg` (סה"כ ~2.3MB, ~3.1MB כחלקי JS).
תמונות, PDF ומדיה כבדה עדיין לא הועלו — ה־bootstrap מחליף אותן אוטומטית בתמונה שקופה
כך שהאפליקציה נטענת ועובדת במלואה.

המניפסט המלא (186 קבצים) שמור ב-`scripts/offline-full-manifest.json`.

### להוספת המדיה בשלב ב'
```bash
cp scripts/offline-full-manifest.json public/updates/manifest.json
# לעדכן version למספר הבא, ואז:
node scripts/convert-parts.mjs
```
כל מה שכבר הומר לא יומר שוב (רישום ב-`scripts/offline-parts-registry.json`).
