
export const db = {
    videos: [{
        id: 1,
        title: "Fack",
        author: "Bukva",
        canBeDownloaded: true,        // дефолтное значение
        minAgeRestriction: null,      // дефолтное значение
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: ["P144"]
    }]
} 