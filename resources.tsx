// Icons
import {
  ListAlt,  
  BroadcastOnHome,  
  CloudQueue,
  Map
  } from "@mui/icons-material";
    
const resources = [
  {
      name: "home",
      list: `/home`,
      meta: {
        icon: <BroadcastOnHome />,
        label: "Home",
        },
    },
    {
        name: "atis",                          
        list: "/atis",
        meta: {
          label: "ATIS",
          icon: <CloudQueue />
        }
    },
    {
      name: "priornotice",                          
      list: "/priornotice",
      create: "/priornotice/create",
      meta: {
        label: "PN",
        icon: <ListAlt />
      }
  },
  {
      name: "fuel",                          
      list: "/fuel",
      create: "/fuel/create",
      meta: {
        label: "Fuel",
        icon: <ListAlt />
      }
  },
  {
      name: "webcam",                          
      list: "/webcam",
      meta: {
        label: "WebCam",
        icon: <ListAlt />
      }
  },
  {
      name: "blog",                          
      list: "/blog",
      create: "/blog/create",
      meta: {
        label: "Blog",
        icon: <ListAlt />
      }
  },
  {
      name: "notams",                          
      list: "/notams",
      meta: {
        label: "NOTAMS",
        icon: <ListAlt />
      }
  },
  {
      name: "info",                          
      list: "/info",
      meta: {
        label: "INFO",
        icon: <ListAlt />
      }
  },
  {
      name: "flyk",                          
      list: "/flyk",
      meta: {
        label: "FLYK",
        icon: <Map />
      }
  },
  {
      name: "weather",                          
      list: "/weather",
      meta: {
        label: "Weather",
        icon: <ListAlt />
      }
  },
  {
      name: "lights",                          
      list: "/lights",
      meta: {
        label: "RWY Lights",
        icon: <ListAlt />
      }
  },
  {
      name: "profiles",                          
      list: "/profile",
      meta: {
        label: "Profile",
        icon: <ListAlt />
      }
  },
  {
      name: "sms",                          
      list: "/sms",
      create: "/sms/create",
      meta: {
        label: "SMS",
        icon: <ListAlt />
      }
  },
  {
      name: "contact",                          
      list: "/contact",
      meta: {
        label: "Contact",
        icon: <ListAlt />
      }
  },
  {
      name: "handbook",                          
      list: "/handbook",
      meta: {
        label:  "Handbook",
        icon: <ListAlt />
      }
  },
  {
      name: "rules",                          
      list: "/rules",
      meta: {
        label: "Rules",
        icon: <ListAlt />
      }
  },
  {
      name: "pic",                          
      list: "/pic",
      meta: {
        label: "PIC Fees",
        icon: <ListAlt />
      }
  },
  {
    name: "admin",                          
    list: "/admin",
    meta: {
      label: "Admin",
      icon: <ListAlt />,
      CanAccess: {resource: "admin", action: "list"}
    }
  }
];

export default resources;