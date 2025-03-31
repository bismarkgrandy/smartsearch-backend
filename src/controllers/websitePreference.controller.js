import WebsitePreference from "../models/websitePreference.model.js";

export const getWebsitePreferences = async (req, res) => {
  try {
    const userId = req.user._id;

    const preferences = await WebsitePreference.findOne({ userId }) || { blockedWebsites: [], boostedWebsites: [] };

    res.json({
      userId: req.user._id,  
      blockedWebsites: preferences.blockedWebsites || [],
      boostedWebsites: preferences.boostedWebsites || [],
    });
  } catch (error) {
    console.error("Error fetching website preferences:", error);
    res.status(500).json({ error: "An error occurred while fetching website preferences." });
  }
};

export const boostWebsite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { website } = req.body;

    if (!website) {
      return res.status(400).json({ error: "Website URL is required" });
    }

    let preferences = await WebsitePreference.findOne({ userId });

    if (!preferences) {
      preferences = new WebsitePreference({ userId, blockedWebsites: [], boostedWebsites: [] });
    }

    const alreadyBoosted = preferences.boostedWebsites.some((site) => 
      site.includes(website) || website.includes(site)
    );

    if (alreadyBoosted) {
      return res.status(400).json({ error: "Website or related subdomain is already boosted" });
    }

    preferences.boostedWebsites.push(website);
    await preferences.save();

    res.json({ message: "Website boosted successfully", boostedWebsites: preferences.boostedWebsites });
  } catch (error) {
    console.error("Error boosting website:", error);
    res.status(500).json({ error: "An error occurred while boosting the website" });
  }
};


export const blockWebsite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { website } = req.body;

    if (!website) {
      return res.status(400).json({ error: "Website URL is required" });
    }

    let preferences = await WebsitePreference.findOne({ userId });

    if (!preferences) {
      preferences = new WebsitePreference({ userId, blockedWebsites: [], boostedWebsites: [] });
    }

    const alreadyBlocked = preferences.blockedWebsites.some((site) => 
      site.includes(website) || website.includes(site)
    );

    if (alreadyBlocked) {
      return res.status(400).json({ error: "Website or related subdomain is already blocked" });
    }

    preferences.blockedWebsites.push(website);
    await preferences.save();

    res.json({ message: "Website blocked successfully", blockedWebsites: preferences.blockedWebsites });
  } catch (error) {
    console.error("Error blocking website:", error);
    res.status(500).json({ error: "An error occurred while blocking the website" });
  }
};


export const unblockWebsite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { website } = req.body;

    if (!website) {
      return res.status(400).json({ error: "Website URL is required" });
    }

    const preferences = await WebsitePreference.findOne({ userId });

    if (!preferences) {
      return res.status(404).json({ error: "No website preferences found" });
    }

    const filteredWebsites = preferences.blockedWebsites.filter(
      (site) => !site.includes(website) && !website.includes(site)
    );

    if (filteredWebsites.length === preferences.blockedWebsites.length) {
      return res.status(404).json({ error: "Website not found in blocked list" });
    }

    preferences.blockedWebsites = filteredWebsites;
    await preferences.save();

    res.json({ message: "Website unblocked successfully", blockedWebsites: preferences.blockedWebsites });
  } catch (error) {
    console.error("Error unblocking website:", error);
    res.status(500).json({ error: "An error occurred while unblocking the website" });
  }
};


  export const unboostWebsite = async (req, res) => {
    try {
      const userId = req.user._id;
      const { website } = req.body;
  
      if (!website) {
        return res.status(400).json({ error: "Website URL is required" });
      }
  
      const preferences = await WebsitePreference.findOne({ userId });
  
      if (!preferences) {
        return res.status(404).json({ error: "No website preferences found" });
      }
  
      const filteredWebsites = preferences.boostedWebsites.filter(
        (site) => !site.includes(website) && !website.includes(site)
      );
  
      if (filteredWebsites.length === preferences.boostedWebsites.length) {
        return res.status(404).json({ error: "Website not found in boosted list" });
      }
  
      preferences.boostedWebsites = filteredWebsites;
      await preferences.save();
  
      res.json({ message: "Website unboosted successfully", boostedWebsites: preferences.boostedWebsites });
    } catch (error) {
      console.error("Error unboosting website:", error);
      res.status(500).json({ error: "An error occurred while unboosting the website" });
    }
  };
  

// export const unblockWebsite = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const websiteId = req.params.id; // Get website ID from params

//     if (!websiteId) {
//       return res.status(400).json({ error: "Website ID is required" });
//     }

//     const preferences = await WebsitePreference.findOne({ userId });

//     if (!preferences) {
//       return res.status(404).json({ error: "No website preferences found" });
//     }

//     const filteredWebsites = preferences.blockedWebsites.filter(
//       (site) => site.toString() !== websiteId
//     );

//     if (filteredWebsites.length === preferences.blockedWebsites.length) {
//       return res.status(404).json({ error: "Website not found in blocked list" });
//     }

//     preferences.blockedWebsites = filteredWebsites;
//     await preferences.save();

//     res.json({ message: "Website unblocked successfully", blockedWebsites: preferences.blockedWebsites });
//   } catch (error) {
//     console.error("Error unblocking website:", error);
//     res.status(500).json({ error: "An error occurred while unblocking the website" });
//   }
// };

// export const unboostWebsite = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const websiteId = req.params.id; // Get website ID from params

//     if (!websiteId) {
//       return res.status(400).json({ error: "Website ID is required" });
//     }

//     const preferences = await WebsitePreference.findOne({ userId });

//     if (!preferences) {
//       return res.status(404).json({ error: "No website preferences found" });
//     }

//     const filteredWebsites = preferences.boostedWebsites.filter(
//       (site) => site.toString() !== websiteId
//     );

//     if (filteredWebsites.length === preferences.boostedWebsites.length) {
//       return res.status(404).json({ error: "Website not found in boosted list" });
//     }

//     preferences.boostedWebsites = filteredWebsites;
//     await preferences.save();

//     res.json({ message: "Website unboosted successfully", boostedWebsites: preferences.boostedWebsites });
//   } catch (error) {
//     console.error("Error unboosting website:", error);
//     res.status(500).json({ error: "An error occurred while unboosting the website" });
//   }
// };
