# Produktanforderungen

## Produkt und Zielgruppe
Die Plattform unterstützt Unternehmen in Gebäudereinigung und Sicherheitsdienst. Startmarkt ist Berlin, danach Deutschland und gegebenenfalls weitere EU-Märkte. Der Gründer plant ein eigenes Unternehmen, das noch nicht gegründet wurde. Das Produkt soll sowohl intern nutzbar sein als auch als B2B-SaaS verkauft werden.

## Produktprinzipien
- Eine Plattform mit gemeinsamem operativem Kern und optional nutzbaren Reinigungs- und Sicherheitsmodulen.
- Modularer Monolith für das MVP.
- Deutsch (de-DE) als Standardsprache; Architektur für Englisch und Persisch mit RTL-Unterstützung für Persisch.
- Mobile, zugängliche Bedienung für operative Mitarbeitende.
- Datenschutz und Mandantentrennung ab dem ersten Datenmodell.
- Funktionen klein validieren; keine voreilige Umsetzung von Abrechnung, KI oder Lohnbuchhaltung.

## MVP
1. Organisationen, Benutzer, Mitgliedschaften und Berechtigungen
2. Mitarbeitende und Qualifikations-/Ablaufdaten
3. Kunden, Serviceorte und Verträge
4. Schichten, Zuweisungen und Arbeitszeiterfassung
5. Einfache Reinigungschecklisten und Leistungsberichte
6. Sicherheitsvorfallmeldungen
7. Deutsches Interface sowie Vorarbeit für Englisch und Persisch
8. Audit-Ereignisse für sensible Änderungen

## Noch nicht im MVP
Lohnabrechnung, Buchhaltung, Rechnungsstellung, automatisierte Abo-Abrechnung, KI-Planung, Kundenportal, native Mitarbeiter-App und fortgeschrittene Lagerverwaltung.

## Nutzerrollen
Plattform-Administrator, Organisationsinhaber, Organisationsadministrator, Betriebsleitung, Supervisor, Mitarbeitender und Kundenportalnutzer. Rollen sollen über Berechtigungen abgebildet werden; Plattformzugriff ist vom Mandantenzugriff zu trennen.

## Erfolgskriterien für Foundation
- Repository-Dokumentation und Resume-Punkt vorhanden.
- App- und Datenbankarchitektur dokumentiert.
- Keine Geheimnisse oder echten personenbezogenen Daten im Repository.
- CI führt Typprüfung, Lint und Tests aus, sobald App-Struktur vorhanden ist.
- Vor Authentifizierung: Sicherheitsdesign geprüft.
