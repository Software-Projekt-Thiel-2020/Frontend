<template>
  <div>
    <v-container class="title">
      <h1>Registrieren</h1>
    </v-container>
    <v-container>
        <form class="container">
            <v-row>
                <v-col cols="9">
                <v-text-field
                v-model="vorname"
                outlined
                label="Vorname"
                class="input"
                />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="9">
                <v-text-field
                v-model="nachname"
                outlined
                label="Nachname"
                class="input"
                />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="9">
                <v-text-field
                v-model="username"
                outlined
                label="Benutzername"
                class="input"
                />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="9">
                <v-text-field
                v-model="pKey"
                outlined
                label="Public Key"
                class="input"
                />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="9">
                <v-text-field
                v-model="email"
                outlined
                label="E-Mail"
                class="input"
                />
                </v-col>
            </v-row>
            <v-row>
            <v-col cols="3">
            <v-btn
                class="submit"
                type="submit"
                block
              >
                Registrieren
              </v-btn>
            </v-col>
            </v-row>
        </form>
    </v-container>
    </div>
</template>

<script>
export default {
  name: 'Registrieren',
  data: () => ({
  }),
};
</script>


<style scoped>

.container {
    display: flex;
    flex-direction: column;
    margin-left: 50px;
}

.input {
    margin-left:25%;
}

.title {
    text-align:center;
}

.submit {
    margin-left: 150%;
  }

</style>
