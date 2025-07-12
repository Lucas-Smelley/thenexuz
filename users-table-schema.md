# 🧾 Users Table Overview (EpicCoin + Gorbz System)

This document outlines the structure and purpose of the `users` table used in the EpicCoin and Gorbz collectible system. Each user has a profile, a floating icon room, a balance of EpicCoins, and a collection of Gorbz with varying rarities.

---

## 📄 Description

The `users` table stores individual user data including:

- Basic identity fields
- Currency balance (EpicCoins)
- Owned Gorbz collectibles (icons)
- Progress tracking (login, collection stats)
- Customization (equipped Gorb, room theme)

Password authentication is handled separately and not stored directly in this table.

---

## 🧩 Table Schema (TypeScript Style)

```ts
users: defineTable({
  username: v.string(),                  // Display name / unique identifier
  email: v.optional(v.string()),        // Optional, for recovery or verification
  createdAt: v.number(),                // Timestamp of account creation

  // Currency System
  epicCoins: v.number(),                // Current balance of EpicCoins

  // Gorbz Collectible System
  gorbz: v.array(v.id("gorbz")),        // List of owned Gorbz (referenced by ID)
  mainGorb: v.optional(v.id("gorbz")),  // Currently equipped Gorb to display

  // Login & Activity
  dailyBonusClaimedAt: v.optional(v.number()), // Last claim time for daily bonus
  lastLogin: v.optional(v.number()),    // Timestamp of most recent login

  // Stats and Tracking
  gorbzCollectedTotal: v.optional(v.number()), // Total Gorbz ever pulled
  gorbzFused: v.optional(v.number()),   // Number of Gorbz fused (if fusion system exists)

  // Customization & Access
  customRoomTheme: v.optional(v.string()), // Theme for floating icon room
  isAdmin: v.optional(v.boolean()),     // Optional admin privilege flag
})
```

---

## 🧠 Suggested Enhancements

- **Profile Badges**: Add support for earned badges or achievements.
- **Social Handles**: Optionally link to Discord, X, or other socials.
- **Inventory Expansion**: Allow for upgrades to increase collectible capacity.

---

> ⚠️ **Security Note:** User authentication (sign-in/sign-up) should be handled by a secure identity provider (e.g. Firebase Auth, Clerk, Supabase Auth). Avoid storing raw passwords.

---

## ✅ Summary

This schema provides a flexible and scalable structure for supporting:

- A live currency and rarity system
- Interactive Gorbz icon collectibles
- A personalized user space for flexing and customization
