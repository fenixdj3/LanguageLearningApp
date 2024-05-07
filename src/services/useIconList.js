import { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "@firebase/storage";

const useIconList = () => {
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    const storage = getStorage();
    const iconsRef = ref(storage, "categoryIcon/"); // Путь к папке с иконками

    const loadIcons = async () => {
      try {
        const result = await listAll(iconsRef);
        const iconUrls = await Promise.all(
          result.items.map(async (itemRef) => {
            const iconName = itemRef.name.replace(".png", ""); // Получаем имя без расширения
            const url = await getDownloadURL(itemRef);
            return { name: iconName, url };
          })
        );
        setIcons(iconUrls);

        // Логирование
        iconUrls.forEach((icon) => {
          console.log(`Icon Name: ${icon.name}, Icon URL: ${icon.url}`);
        });
      } catch (error) {
        console.error("Error loading icons: ", error);
      }
    };

    loadIcons();
  }, []);

  return icons;
};

export default useIconList;
