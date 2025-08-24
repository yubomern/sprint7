#include <iostream>
#include <cstdlib>
#include <cstring>
#include <sstream>
#include <fstream>

#define FILELOGGER "file_logger.txt"
#define MSG_LEN  1024
#define MAX_MSG_ERROR  1024

using namespace std;

void Logger(const char *msg, const char *tmsg, const char *error) {
    FILE *file = fopen(FILELOGGER, "a+");
    if (!file) {
        perror("error opening log file");
        return;
    }
    fprintf(file, "message: %s | tmsg: %s | error: %s\n", msg, tmsg, error);
    fclose(file);
}

int fileSize(const char *filename, int *pos, int *size) {
    char msg[MSG_LEN] = {0};
    char error[MAX_MSG_ERROR] = {0};

    FILE *filein = fopen(filename, "r");
    if (!filein) {
        Logger("error open file", "file input error or mode", "file not found or mode error");
        return -1;
    }

    fseek(filein, 0, SEEK_END);
    int size_ = ftell(filein);
    rewind(filein);

    *size = size_;

    char *buffer = (char *)malloc(sizeof(char) * (size_ + 1));
    if (!buffer) {
        fclose(filein);
        Logger("malloc failed", "buffer alloc", "out of memory");
        return -1;
    }

    while (fgets(buffer, size_, filein)) {
        *pos = ftell(filein);
        snprintf(msg, sizeof(msg), "line read: %s | file size = %d | pos = %d", buffer, *size, *pos);
        snprintf(error, sizeof(error), "file position %d", *pos);
        Logger(msg, "reading file", error);
    }

    free(buffer);
    fclose(filein);
    return 0;
}

void readfile(const char *filename) {
    ifstream filein(filename);
    string buf;
    if (filein.is_open()) {
        while (getline(filein, buf)) {
            Logger(buf.c_str(), "read file", "no error");
            cout << buf <<endl;
        }
        filein.close();
    } else {
        Logger("could not open file", "ifstream open", "error opening file");
    }
}

int main(int argc, const char *argv[]) {
    if (argc < 2) {
        cerr << "Usage: " << argv[0] << " <filename>" << endl;
        return -1;
    }

    readfile(argv[1]);

    int pos = 0, size = 0;
    fileSize(argv[1], &pos, &size);

    return 0;
}
