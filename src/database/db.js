import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import defaultWordsData from "./defaultWordsData";

export const db = SQLite.openDatabase("LanguageLearning2.db");

export const initDB = () => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Users (
          firebase_uid TEXT PRIMARY KEY UNIQUE NOT NULL,
          Email TEXT NOT NULL,
          CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Languages (
          LanguageID INTEGER PRIMARY KEY AUTOINCREMENT,
          Code TEXT NOT NULL,
          Name TEXT NOT NULL
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Categories (
          CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
          firebase_uid TEXT NOT NULL,
          LanguageID INTEGER NOT NULL,
          Name TEXT NOT NULL,
          ImageURL TEXT,
          CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (firebase_uid) REFERENCES Users(firebase_uid),
          FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID)
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Words (
          WordID INTEGER PRIMARY KEY AUTOINCREMENT,
          CategoryID INTEGER NOT NULL,
          EnglishWord TEXT NOT NULL,
          Transcription TEXT,
          Translation TEXT NOT NULL,
          Example TEXT,
          ExampleTranslation TEXT,
          CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS WordProgress (
          WordID INTEGER NOT NULL,
          firebase_uid TEXT NOT NULL,
          Status INTEGER NOT NULL, -- 0 для изучения, 1 для известных слов и т.д.
          Attempts INTEGER DEFAULT 0,
          LastSeen TIMESTAMP,
          NextReviewDate TIMESTAMP,
          Interval INTEGER DEFAULT 1,
          EaseFactor REAL DEFAULT 2.5,
          PRIMARY KEY (WordID, firebase_uid),
          FOREIGN KEY (WordID) REFERENCES Words(WordID),
          FOREIGN KEY (firebase_uid) REFERENCES Users(firebase_uid)
        );`
      );

      // Добавляем начальные данные в таблицу Languages
      tx.executeSql(
        `SELECT COUNT(*) AS count FROM Languages;`,
        [],
        (_, { rows }) => {
          if (rows.item(0).count === 0) {
            tx.executeSql(
              `INSERT INTO Languages (Code, Name) VALUES ('en', 'English');`
            );
            tx.executeSql(
              `INSERT INTO Languages (Code, Name) VALUES ('de', 'German');`
            );
            tx.executeSql(
              `INSERT INTO Languages (Code, Name) VALUES ('fr', 'French');`
            );
          } else {
            console.log("Languages already initialized.");
          }
        },
        (_, error) => {
          console.error("Failed to check languages count:", error);
        }
      );
    },
    (error) => {
      console.log("Ошибка при инициализации БД", error);
    },
    () => {
      console.log("Инициализация БД и создание таблиц прошло успешно");
    }
  );
};

export const addDefaultCategories = (userID, dbTransaction) => {
  // Предполагается, что languageID представляет собой числовой ID, соответствующий языкам в таблице Languages
  // Например: 1 для английского, 2 для немецкого, 3 для французского
  const defaultCategories = [
    {
      name: "Анатомия",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fanatomy.png?alt=media&token=ad052311-c378-4cee-8012-30366fd0fdc1",
      languages: [1, 2, 3], // ID для английского, немецкого и французского языков
    },
    {
      name: "Искусство",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Fart.png?alt=media&token=7e7d04fd-1f9b-4298-9677-8b60dfa6a5f0",
      languages: [1, 2, 3],
    },
    {
      name: "Путешествия",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/languagelearningexpoapp.appspot.com/o/categoryIcon%2Ftravel.png?alt=media&token=c04c918f-baf7-4665-8554-2aa1d1fc1c79",
      languages: [1, 2, 3],
    },
  ];

  defaultCategories.forEach(({ name, imageURL, languages }) => {
    languages.forEach((languageID) => {
      dbTransaction.executeSql(
        `INSERT INTO Categories (firebase_uid, LanguageID, Name, ImageURL) VALUES (?, ?, ?, ?);`,
        [userID, languageID, name, imageURL],
        () => {
          console.log(
            `Категория '${name}' (${languageID}) добавлена для пользователя с ID: ${userID}`
          );
        },
        (_, error) => {
          console.log(
            `Ошибка при добавлении категории '${name}' (${languageID}):`,
            error
          );
        }
      );
    });
  });
};

export const addDefaultWords = (dbTransaction) => {
  const defaultWords = [
    {
      categoryID: 1,
      englishWord: "Heart",
      transcription: "hɑːrt",
      translation: "Сердце",
      example: "His heart was beating fast.",
    },
    // Добавьте другие стандартные слова сюда
  ];

  defaultWords.forEach((word) => {
    dbTransaction.executeSql(
      `INSERT INTO Words (CategoryID, EnglishWord, Transcription, Translation, Example) VALUES (?, ?, ?, ?, ?);`,
      [
        word.categoryID,
        word.englishWord,
        word.transcription,
        word.translation,
        word.example,
      ],
      () => {
        console.log(
          `Слово '${word.englishWord}' добавлено в категорию с ID: ${word.categoryID}`
        );
      },
      (_, error) => {
        console.log(
          `Ошибка при добавлении слова '${word.englishWord}':`,
          error
        );
      }
    );
  });
};

export const addUser = (firebase_uid, email, tx, callback) => {
  tx.executeSql(
    `INSERT INTO Users (firebase_uid, Email) VALUES (?, ?);`,
    [firebase_uid, email],
    (_, result) => {
      // Вызов колбэка с результатом успешного добавления пользователя
      callback(true, result);
    },
    (_, error) => {
      // Вызов колбэка с ошибкой при добавлении пользователя
      callback(false, error);
    }
  );
};

const fetchUsers = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM Users;`,
      [],
      (_, { rows: { _array } }) => {
        console.log("Пользователи:", _array);
      },
      (_, error) => {
        console.log("Ошибка при получении пользователей:", error);
        return true; // для предотвращения пропаганды ошибки
      }
    );
  });
};

export const fetchCategories = (userID, languageID, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT 
        c.CategoryID,
        c.Name,
        c.ImageURL,
        c.LanguageID,
        (SELECT COUNT(*) FROM Words WHERE Words.CategoryID = c.CategoryID) AS WordCount,
        (SELECT COUNT(*) FROM Words w 
         JOIN WordProgress wp ON w.WordID = wp.WordID 
         WHERE w.CategoryID = c.CategoryID AND wp.firebase_uid = ?) AS KnownWordsCount
      FROM Categories c
      WHERE c.firebase_uid = ? AND c.LanguageID = ?;`,
      [userID, userID, languageID],
      (_, { rows: { _array } }) => {
        const categoriesWithProgress = _array.map((category) => ({
          ...category,
          icon: `https://storage.googleapis.com/languagelearningexpoapp.appspot.com/categoryIcon/${category.ImageURL}`,
          Progress:
            category.WordCount > 0
              ? (category.KnownWordsCount / category.WordCount) * 100
              : 0,
        }));
        callback(categoriesWithProgress);
      },
      (_, error) => {
        console.log("Ошибка при получении категорий:", error);
        return true;
      }
    );
  });
};


export const addWordsToCategories = (userID, dbTransaction) => {
  defaultWordsData.forEach(({ languageID, categoryName, words }) => {
    // Получаем CategoryID по имени, userID и LanguageID
    dbTransaction.executeSql(
      `SELECT CategoryID FROM Categories WHERE firebase_uid = ? AND Name = ? AND LanguageID = ?;`,
      [userID, categoryName, languageID],
      (_, { rows }) => {
        if (rows._array.length > 0) {
          const categoryID = rows._array[0].CategoryID;

          // Добавляем слова в эту категорию
          words.forEach(
            ({
              englishWord,
              transcription,
              translation,
              example,
              exampleTranslation,
            }) => {
              dbTransaction.executeSql(
                `INSERT INTO Words (CategoryID, EnglishWord, Transcription, Translation, Example, ExampleTranslation) VALUES (?, ?, ?, ?, ?, ?);`,
                [
                  categoryID,
                  englishWord,
                  transcription,
                  translation,
                  example,
                  exampleTranslation,
                ],
                () =>
                  console.log(
                    `Слово '${englishWord}' добавлено в категорию '${categoryName}' (${languageID})`
                  ),
                (_, error) =>
                  console.log(
                    `Ошибка при добавлении слова '${englishWord}' (${languageID}):`,
                    error
                  )
              );
            }
          );
        } else {
          console.log(
            `Категория '${categoryName}' (${languageID}) не найдена.`
          );
        }
      },
      (_, error) =>
        console.log(
          `Ошибка при получении ID категории '${categoryName}' (${languageID}):`,
          error
        )
    );
  });
};



export const resetDB = () => {
  db.transaction(
    (tx) => {
      tx.executeSql(`DROP TABLE IF EXISTS WordProgress;`);
      tx.executeSql(`DROP TABLE IF EXISTS StudySessions;`);
      tx.executeSql(`DROP TABLE IF EXISTS Words;`);
      tx.executeSql(`DROP TABLE IF EXISTS Categories;`);
      tx.executeSql(`DROP TABLE IF EXISTS Languages;`);
      tx.executeSql(`DROP TABLE IF EXISTS Users;`);
    },
    (error) => {
      console.log("Ошибка при удалении таблиц", error);
    },
    () => {
      console.log("Все таблицы успешно удалены");
      initDB(); // Переинициализация БД
    }
  );
};

export const dropTables = () => {
  db.transaction(
    (tx) => {
      // Удаляем таблицу WordProgress
      tx.executeSql(`DROP TABLE IF EXISTS WordProgress;`);

      // Удаляем таблицу StudySessions
      tx.executeSql(`DROP TABLE IF EXISTS StudySessions;`);

      // Удаляем таблицу Words
      tx.executeSql(`DROP TABLE IF EXISTS Words;`);

      // Удаляем таблицу Categories
      tx.executeSql(`DROP TABLE IF EXISTS Categories;`);

      // Удаляем таблицу Users
      tx.executeSql(`DROP TABLE IF EXISTS Users;`);
    },
    (error) => {
      console.log("Ошибка при удалении таблиц", error);
    },
    () => {
      console.log("Все таблицы успешно удалены");
    }
  );
};

//Добавляет категорию по пользователю, названии категории и изображения
export const addCategory = (
  firebaseUid,
  languageID,
  categoryName,
  imageUrl,
  callback
) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `INSERT INTO Categories (firebase_uid, LanguageID, Name, ImageURL) VALUES (?, ?, ?, ?);`,
        [firebaseUid, languageID, categoryName, imageUrl], // Добавляем languageID в запрос
        (_, result) => {
          console.log("Категория успешно добавлена:", result);
          callback(); // Вызываем колбэк для обновления списка категорий
        },
        (_, error) => {
          console.error("Ошибка при добавлении категории:", error);
        }
      );
    },
    (error) => {
      console.error("Ошибка транзакции:", error);
    }
  );
};

//Вытягивает слова из категории по ID категории
export const fetchWordsByCategoryID = (categoryID, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `SELECT * FROM Words WHERE CategoryID = ?;`,
        [categoryID],
        (_, { rows: { _array } }) => {
          // Если слова найдены, вызываем колбэк функцию с массивом слов
          callback(_array);
        },
        (_, error) => {
          console.error("Ошибка при получении слов по ID категории:", error);
          return true; // Для предотвращения пропаганды ошибки
        }
      );
    },
    (error) => {
      console.error(
        "Ошибка транзакции при получении слов по ID категории:",
        error
      );
    }
  );
};

//Очищает категорию от слов
export const clearCategory = (db, categoryID, onSuccess, onError) => {
  db.transaction((tx) => {
    tx.executeSql(
      `DELETE FROM Words WHERE CategoryID = ?;`,
      [categoryID],
      (_, result) => onSuccess && onSuccess(result),
      (_, error) => onError && onError(error)
    );
  });
};

//Удаляет категорию
export const deleteCategory = (db, categoryID, onSuccess, onError) => {
  db.transaction((tx) => {
    // Сначала удаляем все слова связанные с категорией
    tx.executeSql(
      `DELETE FROM Words WHERE CategoryID = ?;`,
      [categoryID],
      () => {
        // После успешного удаления слов, удаляем саму категорию
        tx.executeSql(
          `DELETE FROM Categories WHERE CategoryID = ?;`,
          [categoryID],
          (_, result) => onSuccess && onSuccess(result),
          (_, error) => onError && onError(error)
        );
      },
      (_, error) => onError && onError(error)
    );
  });
};

export const addWord = (
  categoryID,
  englishWord,
  transcription,
  translation,
  example,
  exampleTranslation,
  onSuccess,
  onError
) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO Words (CategoryID, EnglishWord, Transcription, Translation, Example, ExampleTranslation) VALUES (?, ?, ?, ?, ?, ?);`,
      [
        categoryID,
        englishWord,
        transcription,
        translation,
        example,
        exampleTranslation,
      ],
      (_, result) => {
        console.log("Слово успешно добавлено:", result);
        onSuccess && onSuccess(result);
      },
      (_, error) => {
        console.error("Ошибка при добавлении слова:", error);
        onError && onError(error);
      }
    );
  });
};


export const getRandomWordsForCurrentUser = async (userID, callback) => {
  db.transaction(
    (tx) => {
      // Получаем все категории пользователя
      tx.executeSql(
        `SELECT CategoryID FROM Categories WHERE firebase_uid = ?;`,
        [userID],
        (_, { rows: { _array: categories } }) => {
          console.log("Найденные категории:", categories); // Логируем найденные категории
          if (categories.length > 0) {
            const categoryIDs = categories.map(
              (category) => category.CategoryID
            );
            // Создаем строку с параметрами для IN условия SQL запроса
            const placeholders = categoryIDs.map((_) => "?").join(",");
            // Выбираем все слова из найденных категорий
            tx.executeSql(
              `SELECT * FROM Words WHERE CategoryID IN (${placeholders});`,
              categoryIDs,
              (_, { rows: { _array: words } }) => {
                if (words.length > 0) {
                  // Если слова найдены, перемешиваем их и возвращаем через callback
                  const shuffledWords = shuffleArray(words);
                  callback(shuffledWords);
                } else {
                  console.log("Слова в категориях не найдены");
                  callback(null);
                }
              }
            );
          } else {
            console.log("Категории не найдены для пользователя с ID:", userID);
            callback(null);
          }
        }
      );
    },
    (error) => {
      console.log("Ошибка при выборке слов:", error);
      callback(null);
    }
  );
};

export const exportDatabaseFile = async () => {
  const dbDirectory = `${FileSystem.documentDirectory}SQLite`;
  const dbFilePath = `${dbDirectory}/LanguageLearning1.db`;
  const exportPath = `${FileSystem.cacheDirectory}LanguageLearning1.db`;

  try {
    // Убедитесь, что каталог кэша существует
    await FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory, {
      intermediates: true,
    });
    // Копирование файла базы данных в каталог кэша
    await FileSystem.copyAsync({
      from: dbFilePath,
      to: exportPath,
    });
    console.log(`Database file exported to: ${exportPath}`);
    return exportPath;
  } catch (error) {
    console.error("Failed to export database file:", error);
  }
};

export const moveDatabaseToFileSystem = async () => {
  const exportPath = `${FileSystem.cacheDirectory}LanguageLearning1.db`;
  const targetPath = `${FileSystem.documentDirectory}exported_LanguageLearning1.db`;

  try {
    await FileSystem.moveAsync({
      from: exportPath,
      to: targetPath,
    });
    console.log(`Database file moved to: ${targetPath}`);
    return targetPath;
  } catch (error) {
    console.error("Failed to move database file:", error);
  }
};

export const getNewWordsForCurrentUser = async (
  userID,
  languageID,
  callback
) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `SELECT * FROM Words 
         WHERE CategoryID IN (SELECT CategoryID FROM Categories WHERE firebase_uid = ? AND LanguageID = ?)
         AND WordID NOT IN (SELECT WordID FROM WordProgress WHERE Status = 1);`,
        [userID, languageID],
        (_, { rows: { _array: words } }) => {
          callback(words.length > 0 ? shuffleArray(words) : []);
        },
        (_, error) => {
          console.error("Ошибка при получении новых слов:", error);
          callback([]);
        }
      );
    },
    (error) => {
      console.error("Ошибка транзакции при получении новых слов:", error);
      callback([]);
    }
  );
};

export const getWordsForReview = async (userID, languageID, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `SELECT * FROM Words w
         JOIN WordProgress wp ON w.WordID = wp.WordID
         WHERE wp.firebase_uid = ? AND wp.NextReviewDate <= ? AND w.CategoryID IN 
         (SELECT CategoryID FROM Categories WHERE LanguageID = ?)
         ORDER BY wp.NextReviewDate ASC
         LIMIT 20;`,
        [userID, new Date().toISOString(), languageID],
        (_, { rows: { _array: words } }) => {
          callback(words.length > 0 ? shuffleArray(words) : []);
        },
        (_, error) => {
          console.error("Ошибка при получении слов для повторения:", error);
          callback([]);
        }
      );
    },
    (error) => {
      console.error(
        "Ошибка транзакции при получении слов для повторения:",
        error
      );
      callback([]);
    }
  );
};

export const updateWordProgress = (wordID, quality) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM WordProgress WHERE WordID = ? ORDER BY LastSeen DESC LIMIT 1;`,
      [wordID],
      (_, { rows: { _array } }) => {
        if (_array.length > 0) {
          const progress = _array[0];
          let { Interval, EaseFactor, Attempts, NextReviewDate } = progress;
          Attempts += 1;
          if (quality >= 3) {
            if (Attempts === 1) {
              Interval = 1;
            } else if (Attempts === 2) {
              Interval = 6;
            } else {
              Interval = Math.round(Interval * EaseFactor);
            }
            EaseFactor =
              EaseFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
            if (EaseFactor < 1.3) EaseFactor = 1.3;
            NextReviewDate = new Date();
            NextReviewDate.setDate(NextReviewDate.getDate() + Interval);
          } else {
            Interval = 1;
            Attempts = 0;
            NextReviewDate = new Date();
            NextReviewDate.setDate(NextReviewDate.getDate() + Interval);
          }
          tx.executeSql(
            `UPDATE WordProgress SET Interval = ?, EaseFactor = ?, Attempts = ?, LastSeen = ?, NextReviewDate = ? WHERE WordID = ?;`,
            [
              Interval,
              EaseFactor,
              Attempts,
              new Date().toISOString(),
              NextReviewDate.toISOString(),
              wordID,
            ],
            () =>
              console.log(
                `Word progress updated successfully. Next review date: ${NextReviewDate.toISOString()}`
              ),
            (_, error) =>
              console.error("Failed to update word progress:", error)
          );
        }
      }
    );
  });
};


export const markWordAsLearned = (wordID, firebaseUid) => {
  const nextReviewDate = new Date(); // Установим дату следующего повторения на сегодня
  nextReviewDate.setHours(0, 0, 0, 0);

  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM WordProgress WHERE WordID = ?;`,
      [wordID],
      (_, { rows: { _array } }) => {
        if (_array.length === 0) {
          // Если запись не существует, добавляем новую запись
          tx.executeSql(
            `INSERT INTO WordProgress (WordID, firebase_uid, Status, Attempts, LastSeen, NextReviewDate, Interval, EaseFactor)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              wordID,
              firebaseUid,
              1,
              0,
              new Date().toISOString(),
              nextReviewDate.toISOString(),
              1,
              2.5,
            ],
            (_, result) => {
              console.log(
                `Word ${wordID} added to WordProgress with next review date: ${nextReviewDate.toISOString()}`
              );
            },
            (_, error) => {
              console.error(
                `Failed to add word ${wordID} to WordProgress:`,
                error
              );
            }
          );
        } else {
          // Если запись существует, обновляем существующую запись
          tx.executeSql(
            `UPDATE WordProgress SET Status = 1, NextReviewDate = ? WHERE WordID = ?;`,
            [nextReviewDate.toISOString(), wordID],
            (_, result) => {
              console.log(
                `Word ${wordID} marked as learned. Next review date: ${nextReviewDate.toISOString()}`
              );
            },
            (_, error) => {
              console.error(`Failed to mark word ${wordID} as learned:`, error);
            }
          );
        }
      },
      (_, error) => {
        console.error(
          "Ошибка при проверке существования записи в WordProgress:",
          error
        );
      }
    );
  });
};

export const getAllWordProgress = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM WordProgress;`, // Выбираем все данные из таблицы WordProgress
      [],
      (_, { rows: { _array } }) => {
        if (_array.length > 0) {
          callback(_array); // Возвращаем все записи
        } else {
          callback([]);
        }
      },
      (_, error) => {
        console.error("Ошибка при получении данных из WordProgress:", error);
        callback([]);
      }
    );
  });
};


export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // обмен элементами
  }
  return array;
};

export const database = {
  initDB,
  addDefaultCategories,
  addWordsToCategories,
  addDefaultWords,
  addUser,
  fetchUsers,
  dropTables,
  resetDB,
  fetchCategories,
  addCategory,
  fetchWordsByCategoryID,
  clearCategory,
  deleteCategory,
  addWord,
  shuffleArray,
  getRandomWordsForCurrentUser,
  exportDatabaseFile,
  moveDatabaseToFileSystem,
  getNewWordsForCurrentUser,
  getWordsForReview,
  updateWordProgress,
  markWordAsLearned,
  shuffleArray,
};
