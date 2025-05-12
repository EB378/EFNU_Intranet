// Icons
import {
  ListAlt,  
  BroadcastOnHome,  
  CloudQueue,
  Map,
  PriorityHigh,
  LocalGasStation,
  CameraOutdoor,
  Book,
  Article,
  Info,
  Air,
  Lightbulb,
  AccountBox,
  EnhancedEncryption,


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
      edit: "/priornotice/edit/:id",
      meta: {
        label: "PN",
        icon: <PriorityHigh />,
        canDelete: true
      }
  },
  {
      name: "fuel",                          
      list: "/fuel",
      meta: {
        label: "Fuel",
        icon: <LocalGasStation />
      }
  },
  {
      name: "webcam",                          
      list: "/webcam",
      meta: {
        label: "WebCam",
        icon: <CameraOutdoor />
      }
  },
  {
      name: "blog",                          
      list: "/blog",
      create: "/blog/create",
      meta: {
        label: "Blog",
        icon: <Book />
      }
  },
  {
      name: "notams",                          
      list: "/notams",
      meta: {
        label: "NOTAMS",
        icon: <Article />
      }
  },
  {
      name: "info",                          
      list: "/info",
      meta: {
        label: "INFO",
        icon: <Info />
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
        icon: <Air />
      }
  },
  {
      name: "lights",                          
      list: "/lights",
      meta: {
        label: "RWY Lights",
        icon: <Lightbulb />
      }
  },
  {
      name: "profiles",                          
      list: "/profile",
      edit: "/profile/edit/:id",
      meta: {
        label: "Profile",
        icon: <AccountBox />
      }
  },
  {
      name: "sms",                          
      list: "/sms",
      create: "/sms/create",
      meta: {
        label: "SMS",
        icon: <EnhancedEncryption />
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