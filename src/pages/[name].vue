<script setup lang="ts">
import { NDKFilter, NDKUser, NDKEvent } from "@nostr-dev-kit/ndk";
import { Utils } from "@/utils/utils";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";
import { Shop } from "@/models/shop";

interface currency {
  name: string;
  code: string;
}

interface country {
  name: string;
  code: string;
}

const appStore = useAppStore();
const { currentUser, nostr } = storeToRefs(appStore);

const utils = new Utils();

const item = ref(1);
const name = ref();
const shops = ref(new Set<NDKEvent>());
const currencies = ref([] as currency[]);
const countries = ref([] as country[]);

/**
 * Fields for a new shop
 */
const shopName = ref("");
const shopDesc = ref("");
const shopCurrency = ref([] as string[]);
const shopMinPrice = ref(0);
const shopLocation = ref([] as string[]);

function addShop() {
  item.value = 3;
}

function addMachine() {
  item.value = 4;
}

function submitShop() {
  const shop: Shop = {
    id: utils.generateUUID().replaceAll("-", ""),
    name: shopName.value,
    description: shopDesc.value,
    currency: shopCurrency.value,
    min_price: shopMinPrice.value,
    location: shopLocation.value,
  };
  console.log(shop);
}

async function fetchShopEvents(): Promise<Set<NDKEvent>> {
  const filter: NDKFilter = {
    kinds: [30110],
    authors: [currentUser.value?.pubkey],
  };
  const events = await nostr.value.ndk.fetchEvents(filter);
  return events;
}

onMounted(async () => {
  shops.value = await fetchShopEvents();
  console.log(shops.value.values);
  currencies.value = await utils.getCurrencies();
  countries.value = await utils.getCountries();
  console.log(currencies.value);
});

watch(currentUser, async (user: NDKUser | null) => {
  if (user && user.profile) name.value = user.profile.name;
});
</script>

<template>
  <head>
    <title>{{ name }}</title>
  </head>
  <Profile />
  <v-window v-model="item" show-arrows="hover">
    <v-window-item :value="1" key="machines">
      <v-container>
        <v-card class="ma-2" height="200">
          <v-card-title>Shops</v-card-title>
          <v-card-text></v-card-text>
          <v-card-actions>
            <v-btn text="Add Shop" @click="addShop"></v-btn>
            <v-btn text="Add Machine" @click="addMachine"></v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-window-item>
    <v-window-item :value="2" key="orders">
      <v-container>
        <v-card height="200">
          <v-card-title>Orders</v-card-title>
          <v-card-subtitle>Orders will be displayed here</v-card-subtitle>
        </v-card>
      </v-container>
    </v-window-item>
    <v-window-item :value="3" key="addShop">
      <v-container>
        <v-card class="ma-2">
          <v-card-title>Add Shop</v-card-title>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="shopName"
                    label="Shop Name"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="shopLocation"
                    label="Country"
                    :items="countries"
                    item-title="name"
                    item-value="name"
                    autocomplete="off"
                    hint="select the country where the shop is located"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea
                    v-model="shopDesc"
                    label="Description"
                    rows="1"
                    auto-grow
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-combobox
                    v-model="shopCurrency"
                    label="Accepted Currencies"
                    :items="currencies"
                    item-title="name"
                    item-value="name"
                    multiple
                  ></v-combobox>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="shopMinPrice"
                    type="number"
                    label="Minimum Order amount"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <v-card-actions>
            <v-btn
              text="Add Shop"
              elevation="4"
              @click="submitShop"
              block
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-window-item>
    <v-window-item :value="4" key="addMachine">
      <v-container>
        <v-card class="ma-2">
          <v-card-title>Add Machine</v-card-title>
          <v-form>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field label="Machine Name"></v-text-field>
                </v-col>
                <v-col>
                  <v-combobox
                    label="Currency"
                    multiple
                    :items="['SATS', 'USD']"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea
                    label="Description"
                    rows="1"
                    auto-grow
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <v-card-text>Machine Capabilities</v-card-text>
              </v-row>
              <v-row>
                <v-col cols="12" md="4">
                  <v-combobox
                    label="Type"
                    :items="['3D Printer', 'CNC', 'Laser Cutter']"
                  ></v-combobox>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-container>
    </v-window-item>
  </v-window>
  <!-- <v-slide-group show-arrows="false">
    <v-slide-group-item key="Machines"
      ><v-btn class="ma-2" rounded>Machines</v-btn></v-slide-group-item
    >
  </v-slide-group> -->
</template>
