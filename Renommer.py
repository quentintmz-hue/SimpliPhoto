import os
from pathlib import Path

# Majuscule conforme à ton dossier VS Code
DOSSIER_IMAGES = Path("Images")

# Extensions prises en compte
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

def standardiser_photos():
    if not DOSSIER_IMAGES.exists():
        print(f"Erreur : le dossier '{DOSSIER_IMAGES}' n'a pas été trouvé à la racine.")
        return

    dossiers = [d for d in DOSSIER_IMAGES.iterdir() if d.is_dir()]
    if not dossiers:
        print(f"Aucun sous-dossier trouvé dans '{DOSSIER_IMAGES}'.")
        return

    for dossier in sorted(dossiers):
        fichiers = [f for f in dossier.iterdir() if f.suffix.lower() in EXTENSIONS]
        fichiers.sort(key=lambda x: x.name)

        print(f"Traitement de : {dossier.name} ({len(fichiers)} photos trouvées)")

        if not fichiers:
            continue

        # Étape 1 : nom temporaire pour éviter d'écraser des fichiers existants
        fichiers_temp = []
        for i, f in enumerate(fichiers):
            temp_nom = dossier / f"__temp_{i}{f.suffix.lower()}"
            f.rename(temp_nom)
            fichiers_temp.append(temp_nom)

        # Étape 2 : numérotation propre 1.jpg, 2.jpg...
        for i, f in enumerate(fichiers_temp, start=1):
            final_nom = dossier / f"{i}{f.suffix.lower()}"
            f.rename(final_nom)

    print("\nTerminé ! Toutes les photos sont renommées.")

if __name__ == "__main__":
    standardiser_photos()