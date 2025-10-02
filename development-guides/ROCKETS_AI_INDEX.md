# 🤖 ROCKETS AI NAVIGATION HUB

> **For AI Tools**: This is your navigation hub for Rockets SDK development. Use this to quickly find the right guide for your task.

## 📋 **Quick Tasks**

### **🏗️ Phase 1: Project Foundation Setup**
| Task | Guide | Lines |
|------|-------|-------|
| **Choose packages** (rockets-server vs rockets-server-auth) | [ROCKETS_PACKAGES_GUIDE.md](./ROCKETS_PACKAGES_GUIDE.md) | 400 |
| **Configure application** (main.ts, modules, env) | [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md) | 250 |
| **Provide dynamic repo token** (`userMetadata` via `TypeOrmExtModule.forFeature`) | [ROCKETS_PACKAGES_GUIDE.md](./ROCKETS_PACKAGES_GUIDE.md#phase-31-dynamic-repository-tokens-critical) | ~

### **🎯 Phase 2: Module Development**
| Task | Guide | Lines |
|------|-------|-------|
| **Generate complete modules** (copy-paste templates) | [AI_TEMPLATES_GUIDE.md](./AI_TEMPLATES_GUIDE.md) | 900 |
| **CRUD patterns** (services, controllers, adapters) | [CRUD_PATTERNS_GUIDE.md](./CRUD_PATTERNS_GUIDE.md) | 300 |
| **Add security** (access control, permissions) | [ACCESS_CONTROL_GUIDE.md](./ACCESS_CONTROL_GUIDE.md) | 200 |
| **Create DTOs** (validation, PickType patterns) | [DTO_PATTERNS_GUIDE.md](./DTO_PATTERNS_GUIDE.md) | 150 |

### **🔧 Advanced Integration**
| Task | Guide | Lines |
|------|-------|-------|
| **Add @concepta packages** (ecosystem integration) | [CONCEPTA_PACKAGES_GUIDE.md](./CONCEPTA_PACKAGES_GUIDE.md) | 350 |

---

## 🚦 **Development Workflow**

### **New Project Setup (5 minutes)**
1. 📖 Read [ROCKETS_PACKAGES_GUIDE.md](./ROCKETS_PACKAGES_GUIDE.md) - Choose your packages
2. 📖 Read [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md) - Configure your app

### **Module Generation (Per entity)**
1. 📖 Read [AI_TEMPLATES_GUIDE.md](./AI_TEMPLATES_GUIDE.md) - Generate 12-file module
2. 📖 Read [CRUD_PATTERNS_GUIDE.md](./CRUD_PATTERNS_GUIDE.md) - Implement CRUD operations
3. 📖 Read [ACCESS_CONTROL_GUIDE.md](./ACCESS_CONTROL_GUIDE.md) - Add security
4. 📖 Read [DTO_PATTERNS_GUIDE.md](./DTO_PATTERNS_GUIDE.md) - Create DTOs

---

## 🎯 **Package Ecosystem Overview**

### **Core Rockets Packages**
- **@bitwild/rockets-server**: Minimal auth + user metadata (2 endpoints)
- **@bitwild/rockets-server-auth**: Complete auth system (15+ endpoints)

### **@concepta Package Categories (32 total)**
- **Core**: common, crud, typeorm-ext (5 packages)
- **Auth**: local, jwt, google, github, apple, etc. (11 packages) 
- **Features**: access-control, email, file, etc. (16 packages)

---

## 📊 **Token Efficiency Guide**

### **For AI Tools - Optimal Reading Strategy:**
1. **Always start here** - ROCKETS_AI_INDEX.md (50 lines)
2. **Pick one guide** based on your task (150-400 lines each)
3. **Never read multiple guides** in one session (token limit)

### **File Size Reference:**
- 🟢 **Small** (50-200 lines): Quick reference, read anytime
- 🟡 **Medium** (200-400 lines): Perfect AI context size
- 🔴 **Large** (400+ lines): Read in focused sessions only

---

## 🎯 **AI Prompt Optimization**

### **For Setup Tasks:**
```
I need to setup a new project with Rockets SDK.
Read ROCKETS_PACKAGES_GUIDE.md and help me choose the right packages.
```

### **For Module Generation:**
```
I need to create a {Entity} module following Rockets patterns.
Read AI_TEMPLATES_GUIDE.md and generate all 12 files for me.
```

### **For CRUD Implementation:**
```
I need to implement CRUD operations for my {Entity} module.
Read CRUD_PATTERNS_GUIDE.md and show me the latest patterns.
```

### **For Security:**
```
I need to add access control to my {Entity} module.
Read ACCESS_CONTROL_GUIDE.md and implement the security patterns.
```

---

## ⚡ **Success Metrics**

**Your implementation is AI-optimized when:**
- ✅ Zero manual fixes needed after generation
- ✅ All TypeScript compilation errors resolved
- ✅ Proper business logic implementation
- ✅ Complete API documentation in Swagger
- ✅ Access control properly configured
- ✅ Error handling follows established patterns

---

**🚀 Start your journey: Pick a guide above and begin building with Rockets SDK!**